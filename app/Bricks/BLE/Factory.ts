import {BrickBLE} from "./BLE";
import {BLEDeviceDescription} from "./BLE.data";
import {BLEBridge} from "./Bridge";

export type FactoryBLE = (bridge: BLEBridge, dd: BLEDeviceDescription) => BrickBLE;
const factories: FactoryBLE[] = [];

export function createBLEBrick(bridge: BLEBridge, dd: BLEDeviceDescription): BrickBLE {
    return factories.reduce(
        (b: BrickBLE, f: FactoryBLE) => b || f(bridge, dd),
        undefined
    );
}

export function registerFactory( f: FactoryBLE ) {
    factories.push( f );
}
