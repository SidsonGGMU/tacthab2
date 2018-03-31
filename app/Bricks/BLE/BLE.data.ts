export interface BLECharacteristic {
    name: string
    uuid: string;
    type: string;
    properties: string[];
}

export interface BLEService {
    name: string
    uuid: string;
    type: string;
    characteristics: BLECharacteristic[];
}

export interface BLEDeviceDescription {
    name: string
    uuid: string;
    isConnected: boolean;
    deviceType: string;
    state: {[key: string]: any};
    services?: BLEService[];
    characteristics?: BLECharacteristic[];
}

export interface BridgeState {
    state: {
        isOn: boolean;
        scanning: boolean;
        err: string;
    };
    devices: BLEDeviceDescription[]
}
