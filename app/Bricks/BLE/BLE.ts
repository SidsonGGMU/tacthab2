import {Brick} from "../Brick";
import {BLEDeviceDescription} from "./BLE.data";
import {BridgeInterface} from "./Bridge.interface";


export abstract class BrickBLE extends Brick {

    constructor(private bridge: BridgeInterface, protected deviceDescription: BLEDeviceDescription) {
        super({
            name: deviceDescription.name || deviceDescription.uuid,
            id: deviceDescription.uuid
        });
        this.types.push("BLE");
    }

    dispose() {
        this.disconnect();
        super.dispose();
    }

    call(method: string, ...args: any[]) {
        this.bridge.call({
            deviceId: this.deviceDescription.uuid,
            method,
            arguments: args
        });
    }

    connect(c: boolean = true) {
        this.call(c ? "connect" : "disconnect" );
    }

    disconnect() {
        this.connect(false);
    }

    updateDescription(update: {[key: string]: any}) {
        this.deviceDescription.state = {...this.deviceDescription.state, ...update};
        this.subjectEvents.next({
            attribute: "updateState",
            data: update
        });
    }

    updateIsConnected(isConnected: boolean) {
        this.deviceDescription.isConnected = isConnected;
        this.subjectEvents.next({
            attribute: "updateIsConnected",
            data: isConnected
        });

    }

    isConnected(): boolean {
        return this.deviceDescription.isConnected;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            BLE: this.deviceDescription
        };
    }
}
