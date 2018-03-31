import {BrickBLE} from "./BLE";
import {BLEDeviceDescription} from "./BLE.data";
import {BLEBridge} from "./Bridge";
import {registerFactory} from "./Factory";

export type SENSOR = "accelerometer" | "gyroscope";

export class MetaWear extends BrickBLE {

    constructor(bridge: BLEBridge, deviceDescription: BLEDeviceDescription) {
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
