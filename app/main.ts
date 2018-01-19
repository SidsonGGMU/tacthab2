import {app, /*delSocketObs, newSocketObs,*/ emitOnSocketIO} from "./webServer/webServer";
import {RegisterTest} from "./test/test";
import {/*Brick, getBrickFromId, getBricks,*/ obsNewBrick} from "./Bricks/Brick";
import {CP} from "./Bricks/UPnP/ControlPoint";


CP  .getObsDeviceAppears().subscribe(
    D => console.log("UPnP device", D.getType(), D.getUSN() )
);


app.get("/ping", (req, res) => {
    res.end("pong");
});

//
RegisterTest(app);

obsNewBrick.forEach( B => {
    B.obsEvents.forEach( evt => {
        // console.log("emitOnSocketIO", evt);
        emitOnSocketIO(B.getID(), evt);
    } );
});
