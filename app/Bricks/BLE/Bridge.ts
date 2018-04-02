import * as io from "socket.io-client";
import {BehaviorSubject, Observable} from "@reactivex/rxjs";
import {BridgeState} from "./BLE.data";
import {BrickBLE} from "./BLE";
import {createBLEBrick} from "./Factory";
import {Brick} from "../Brick";
import {BridgeInterface} from "./Bridge.interface";

export class BLEBridge extends Brick implements BridgeInterface {
    private isConnected = new BehaviorSubject<boolean>(false);
    private socket;
    private BLEBricks: BrickBLE[] = [];

    constructor( config: {name: string, id?: string, host: string, port: string} ) {
        super({name: config.name, id: config.id});
        this.types.push( "BLEBridge" );

        const {host, port} = config;
        this.socket = io.connect( `http://${host}:${port}` ); // ({host, port});
        this.socket.on("connect", () => this.isConnected.next(true) );
        this.socket.on("disconnect", () => this.isConnected.next(false) );

        // Bridge State changed, maybe some bricks changes ?
        this.socket.on("bridgeState", (bridgeState: BridgeState) => {
            const devices = bridgeState.devices;
            const bricksToDelete  = this.BLEBricks.filter( B => !devices.find( D => D.uuid === B.getID() ) );
            const devicesToCreate = devices.filter( D => !this.BLEBricks.find( B => D.uuid === B.getID() ) );

            // Remove
            bricksToDelete.forEach(B => B.dispose() );

            // Update
            const newBricks = [];
            this.BLEBricks.forEach( B => {
                const device = devices.find( D => D.uuid === B.getID() );
                if (device) {
                    newBricks.push( B );
                }
            });

            // Append
            this.BLEBricks = [
                ...newBricks,
                ...devicesToCreate.map( D => createBLEBrick(this, D) ).filter(D => !!D )
            ];
        });

        // A device connection state changed
        this.socket.on("deviceConnectedUpdate", (update: {uuid: string, isConnected: boolean}) => {
            const {uuid, isConnected} = update;
            const brick = this.getBrick(uuid);
            if (brick) {
                brick.updateIsConnected(isConnected);
            }
        });

        // A device state changed
        this.socket.on("deviceStateUpdate", (deviceUpdate: {uuid: string, update: {[key: string]: any}}) => {
            const {uuid, update} = deviceUpdate;
            const brick = this.getBrick(uuid);
            if (brick) {
                brick.updateDescription(update);
            }
        });

    }

    getIsConnected(): {connected: boolean, obs: Observable<boolean>} {
        return {
            connected: this.isConnected.getValue(),
            obs: this.isConnected.asObservable()
        };
    }

    call(c: {deviceId: string, method: string, arguments: any[]}) {
        this.socket.emit("call", c);
    }

    private getBrick(uuid: string): BrickBLE {
        return this.BLEBricks.find( B => B.getID() === uuid );
    }

}

