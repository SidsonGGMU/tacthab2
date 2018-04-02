import {BrickBLE} from "./BLE";
import {BLEDeviceDescription} from "./BLE.data";
import {BridgeInterface} from "./Bridge.interface";

export type FactoryBLE = (bridge: BridgeInterface, dd: BLEDeviceDescription) => BrickBLE;
const factories: FactoryBLE[] = [];

export function createBLEBrick(bridge: BridgeInterface, dd: BLEDeviceDescription): BrickBLE {
    return factories.reduce(
        (b: BrickBLE, f: FactoryBLE) => b || f(bridge, dd),
        undefined
    );
}

export function registerFactory( f: FactoryBLE ) {
    factories.push( f );
}
