import * as ioClient from "socket.io-client";
import * as uuid from "uuid";
import * as request from "request";
import {Brick} from "../Brick";
import {BehaviorSubject, Subject, Observable} from "@reactivex/rxjs";

const socketBus_uuid = uuid.v4();
let external_IP_v4 = "";

export interface SocketBusInterface {
    connect(host: string, login: string, pass: string);
    getObsConnected(): Observable<boolean>;
    getObsMessage(): Observable<SocketBusData>;
    send(title: string, message: string);
}

export type SocketBusData = {
    title: string;
    message: any;
};

class SocketBus extends Brick implements SocketBusInterface {
    private host: string;
    private login: string;
    private pass: string;
    private socket;
    private subjConnected = new BehaviorSubject<boolean>( false );
    private subjMessage   = new Subject<SocketBusData>();

    private obsConnected = this.subjConnected.asObservable();
    private obsMessage   = this.subjMessage.asObservable();

    constructor(id: string) {
        super( {id, name: "SocketBus on TActHab 2"} );
    }

    getObsConnected(): Observable<boolean> {
        return this.obsConnected;
    }

    getObsMessage(): Observable<SocketBusData> {
        return this.obsMessage;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            connected: this.subjConnected.getValue(),
            host: this.host,
            login: this.login
        };
    }

    connect(host: string, login: string, pass: string): Observable<boolean> {
        this.host   = host;
        this.login  = login;
        this.pass   = pass;

        this.socket = ioClient( host );

        this.socket.on( "connect", () => {
            this.subjConnected.next(true);
            this.socket.emit( "login", {login: login, pass: pass}, (res: string) => {
                if (res === "banco") {
                    this.socket.emit( "subscribe", {
                        id		: "all",
                        data	: {
                            title	: ".*",
                            regexp	: true
                        }
                    });
                    this.socket.on( "all", (data: SocketBusData) => this.subjMessage.next(data) );
                    this.ping();
                }
            }); // socket.emit( 'login' ... )
        }); // End of on connect
        this.socket.on( "disconnect", () => {
            this.subjConnected.next(false);
            setTimeout( () => this.connect( host, login, pass ), 1000 );
        });
        this.socket.on( "ping", (msg) => {
            // console.log( "socketBus send back a pong on", msg );
            this.send("pong", JSON.stringify( {
                    uuid 			: socketBus_uuid,
                    friendlyName	: this.getName(),
                    external_IP_v4	: external_IP_v4
                } )
            );

            request.get( "http://checkip.amazonaws.com/", (err, httpResponse, body) => {
                if (!err && (external_IP_v4 !== body)) {
                    external_IP_v4 = body;
                    this.send( "pong", JSON.stringify( {
                            uuid 			: socketBus_uuid,
                            friendlyName	: this.getName(),
                            external_IP_v4	: external_IP_v4
                        } )
                    );
                }
            });
        });
        return this.subjConnected.asObservable();
    } // End of connect

    send(title: string, message: string) {
        request.post( `${this.host}/broadcast`).form( {
            login: this.login,
            pass: this.pass,
            title: title,
            message: message
        });
    }

    ping() {
        this.send("ping", "");
    }
}

function getSocketBus(): SocketBusInterface {
    return new SocketBus( "socketBus" );
}

export const socketBus = getSocketBus();

request.get( "http://checkip.amazonaws.com/", function(err, httpResponse, body) {
    if (err) {
        console.error( "Error getting IP v4 from http://checkip.amazonaws.com/" );
    } else {
        external_IP_v4 = body;
        console.log( "external_IP_v4 =", external_IP_v4 );
    }
});
