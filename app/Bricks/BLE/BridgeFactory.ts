import {Brick} from "../Brick";
import {BLEBridge} from "./Bridge";

class BridgeFactoryBLE extends Brick {
    private bridges: BLEBridge[] = [];

    constructor() {
        super( {name: "BLE Bridge Factory", id: "BridgeFactoryBLE"} );
        this.types.push( "BridgeFactoryBLE" );
    }

    createBridge(config: {host: string, port: string}): string {
        const {host, port} = config;
        const bridge = new BLEBridge({...config, name: `BLE Bridge on ${host}:${port}`} );
        this.bridges.push( bridge );
        return bridge.getID();
    }

    deleteBridge(id: string) {
        const bridge = this.bridges.find( B => B.getID() === id);
        if (bridge) {
            bridge.dispose();
            this.bridges = this.bridges.filter( B => B.getID() !== id );
        } else {
            throw `There is no BLEBridge identified by ${id}`;
        }
    }
}

export const bridgeFactoryBLE = new BridgeFactoryBLE();
