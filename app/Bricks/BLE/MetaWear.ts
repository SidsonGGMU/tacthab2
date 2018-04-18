import {BrickBLE} from "./BLE";
import {BLEDeviceDescription} from "./BLE.data";
import {registerFactory} from "./Factory";
import {BridgeInterface} from "./Bridge.interface";
import {BrickEvent} from "../Brick";
import {BrickEmitter} from "../CCBL/CcblDataStructures";

export type SENSOR = "accelerometer" | "gyroscope";
export type ACCELERATION = {
    x: number;
    y: number;
    z: number;
};

export type GYROMEASURE = {
    alpha: number;
    beta: number;
    gamma: number;
};

export interface MetaWearDeviceDescription extends BLEDeviceDescription {
    state: {
        buttonPressed: boolean;
        acc?: ACCELERATION;
        gyr: GYROMEASURE;
    };
}

export class MetaWear extends BrickBLE {
    protected deviceDescription: MetaWearDeviceDescription;

    constructor(bridge: BridgeInterface, deviceDescription: MetaWearDeviceDescription) {
        super(bridge, deviceDescription);
        this.types.push("METAWEAR");

        // Define emitters
        const emitterButton = new BrickEmitter<boolean>({
            emitterName: "button",
            type: "true | false",
            initialAccessor: () => this.getButtonPressed(),
            obsUpdate: this .getObservableEvents()
                            .filter ( (evt: BrickEvent) => evt.attribute === "updateState" && evt.data.buttonPressed !== undefined )
                            .map    ( (evt: BrickEvent) =>  (evt.data.buttonPressed as boolean) )
        });
        const emitterAcceleration = new BrickEmitter<ACCELERATION>({
            emitterName: "acceleration",
            type: "{x, y, z}",
            initialAccessor: undefined,
            obsUpdate: this .getObservableEvents()
                            .filter( (evt: BrickEvent) => evt.attribute === "updateState" && evt.data.acc )
                            .map( (evt: BrickEvent) =>  evt.data.acc as ACCELERATION )
        });
        const emitterGyroscope = new BrickEmitter<GYROMEASURE>({
            emitterName: "gyroscope",
            type: "{alpha, beta, gamma}",
            initialAccessor: undefined,
            obsUpdate: this .getObservableEvents()
                            .filter( (evt: BrickEvent) => evt.attribute === "updateState" && evt.data.gyr )
                            .map( (evt: BrickEvent) =>  evt.data.gyr as GYROMEASURE )
        });
        this.brickEmitters.set( emitterButton.emitterName       , emitterButton       );
        this.brickEmitters.set( emitterAcceleration.emitterName , emitterAcceleration );
        this.brickEmitters.set( emitterGyroscope.emitterName    , emitterGyroscope    );
    }

    getButtonPressed(): boolean {
        return this.deviceDescription.state.buttonPressed;
    }

    startNotifying(sensor: SENSOR) {
        this.call( "startNotifying", sensor);
    }

    stopNotifying(sensor: SENSOR) {
        this.call( "stopNotifying", sensor);
    }

    getBrickEmitters(): BrickEmitter<any>[] {
        return [...this.brickEmitters.values()];
    }
}

registerFactory( (bridge, dd: MetaWearDeviceDescription) => {
    if (dd.deviceType === "METAWEAR") {
        return new MetaWear(bridge, dd);
    } else {
        return undefined;
    }
});

