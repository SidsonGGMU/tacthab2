import * as express from "express";
import * as http from "http";                   // HTTP server
import * as https from "https";                 // HTTPS server
import * as bodyParser from "body-parser";      // Parse HTTP GET and POST variables
import * as path from "path";                   // Deal with system paths
import * as socketIO from "socket.io";          // Websocket server
import * as passport from "passport";           // Connection manager
import * as cookieParser from "cookie-parser";  // Cookie parser
import * as session from "express-session";     // Session manager
import * as fs from "fs-extra";                 // Acces to files
import {Subject, Subscription} from "@reactivex/rxjs";
import {RegisterOAuth, checkIsAuthentified, getUserFromId} from "./OAuth";
import {Brick, getBrickFromId, getBricks, obsDisposeBrick, obsNewBrick} from "../Bricks/Brick";

export const app: express.Application = express();

// HTTP
const serverHTTP = http.createServer(app);
const portHTTP = process.env.PORT || 8888;
serverHTTP.listen(portHTTP, () => {
    console.log(`HTTP server running on port ${portHTTP}`);
});

// HTTPS
const portHTTPS = 8443;
const TLS_SSL =	{
    key : fs.readFileSync( path.join(__dirname, "../../MM.pem"	        ) ),
    cert: fs.readFileSync( path.join(__dirname, "../../certificat.pem" ) )
};
const serverHTTPS = https.createServer(TLS_SSL, app).listen(portHTTPS, () => {
    console.log(`HTTPS server running on port ${portHTTPS}`);
});

// COnfigure the web server
let sessionMiddleware = session({
    secret: "thisIsAVerySecretMessage",
    resave: true,
    saveUninitialized: true
});
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));

app.use(sessionMiddleware); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

RegisterOAuth(app); // OAuth2

// Fonction to check identification and redirect to login page of not identhified
const IdentifiedOrLogin = checkIsAuthentified(401, "/login.html");

// Static files
const dataPath = path.join(__dirname, "../../data");
app.use("/data", IdentifiedOrLogin, express.static(dataPath) );

const angularClientPath = path.join(__dirname, "../../clientAngular");
app.get("/login.html", (req, res) => {
    res.sendFile( path.join(__dirname, "../../data/login.html") );
});
app.use(IdentifiedOrLogin, express.static( angularClientPath ));


app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

// Setup Socket.io server
// const io = socketIO(server);
const newSocketSubject = new Subject<SocketIO.Socket>();
export const newSocketObs = newSocketSubject.asObservable();
const delSocketSubject = new Subject<SocketIO.Socket>();
export const delSocketObs = delSocketSubject.asObservable();

/* Configure the socket.io protocol :
    - Inputs  :
        * call              : message is an object that encode a method call on a brick
            | brickId   : string
            | method    : string
            | arguments : any[]
        * getBricks         : message is the array of JSON bricks.
    - Outputs :
        * Hello             : message is the Passport of the client
        * brickAppears      : message is the JSON of the brick
        * brickDisappears   : message is the ID of the brick
*/
function configureSocketIO(io: SocketIO.Server) {
    const mapSubscriptionsBrickEvents = new Map<string, Subscription>();

    obsNewBrick.subscribe( (B: Brick) => {
        console.log("emit brickAppears", B.getID());
        io.emit("brickAppears", B.toJSON() );
        // Subscribe to brick events
        const subscription = B.obsEvents.subscribe( evt => io.emit( "brickEvent", {
            brickId: B.getID(),
            ...evt
        }) );
        mapSubscriptionsBrickEvents.set(B.getID(), subscription);
    });

    obsDisposeBrick.subscribe(B => {
        const subscr = mapSubscriptionsBrickEvents.get(B.getID());
        subscr.unsubscribe();
        mapSubscriptionsBrickEvents.delete(B.getID());
        console.log("emit brickDisappears", B.getID());
        io.emit("brickDisappears", B.getID() );
    });

    io.use(function (socket, next) {
        sessionMiddleware(socket.request, {}, next);
    }).on("connection", socket => {
        let passportJSON = socket.request.session.passport;
        if (passportJSON && passportJSON.user) {
            console.log("passportJSON:", passportJSON);
            newSocketSubject.next(socket); // .next(socket);
            socket.emit("Hello", {passportJSON: getUserFromId(passportJSON.user)});
            socket.on("disconnect", () => delSocketSubject.next(socket));
            socket.on("call", (call: CALL, cb) => {
                const {brickId, method, arguments: Largs} = call;
                const brick = getBrickFromId(brickId);
                if (!brick) {
                    cb({error: `There is no brick identified by ${brickId}`});
                } else {
                    Promise.resolve().then(() => brick[method].apply(brick, Largs)).then(
                        res => {
                            cb({success: res});
                            // console.log("Call success", res);
                        },
                            err => cb({error: err, brickId, method, Largs})
                    );
                }
            });
            socket.on("getBricks", (cb) => {
                cb( getBricks().map( B => B.toJSON() ) );
            });
        } else {
            console.log("Closing socket.io connection: no passport information.");
            socket.disconnect();
        }
    });
}
const ioHTTP  = socketIO(serverHTTP );
const ioHTTPS = socketIO(serverHTTPS);
configureSocketIO(ioHTTP );
configureSocketIO(ioHTTPS);

export function emitOnSocketIO(title: string, data: any) {
    ioHTTP .emit(title, data);
    ioHTTPS.emit(title, data);
}

type CALL = {
    brickId: string;
    method: string;
    arguments: any[];
};
