import {BrickBLE} from "./BLE";
import {BLEDeviceDescription} from "./BLE.data";
import {registerFactory} from "./Factory";
import {BridgeInterface} from "./Bridge.interface";

export type SENSOR = "accelerometer" | "gyroscope";

export class MetaWear extends BrickBLE {

    constructor(bridge: BridgeInterface, deviceDescription: BLEDeviceDescription) {
        super(bridge, deviceDescription);
        this.types.push("METAWEAR");
    }

    startNotifying(sensor: SENSOR) {
        this.call( "startNotifying", sensor);
    }

    stopNotifying(sensor: SENSOR) {
        this.call( "stopNotifying", sensor);
    }

    // Propose something to access easily to sensors measurements (acc, gyr, button, ...)
    // Based on an Observable maybe ?
    // So that it can be plugged easily to CCBL
}

registerFactory( (bridge, dd) => {
    if (dd.deviceType === "METAWEAR") {
        return new MetaWear(bridge, dd);
    } else {
        return undefined;
    }
});
