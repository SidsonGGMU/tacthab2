import {Brick, BrickJSON} from "../Brick";
import {Device, CALL, CALL_RESULT, Service, DeviceJSON} from "alx-upnp";
import {Subscription} from "@reactivex/rxjs/dist/package";


export interface BrickUPnPJSON extends BrickJSON {
    deviceUPnP: DeviceJSON;
}

export class BrickUPnP extends Brick {
    subscriptions: Subscription[] = [];

    constructor(protected device: Device) {
        super( {
            name: device.toJSON().friendlyName,
            id: device.getUSN()
        } );
        this.types.push("BrickUPnP");

        // Subscribe to events
        device.getServices().forEach( S => {
            S.stateVariables.forEach( V => {
                this.subscriptions.push(
                    V.getObservable().subscribe( value => {
                        // sendEvent(device, S, V, value);
                        this.subjectEvents.next({
                            attribute: S.serviceId,
                            data: {
                                stateVariable: V.getName(),
                                value: value
                            }
                        });
                    })
                );
            });
        });
    }

    dispose() {
        this.subscriptions.forEach(
            S => S.unsubscribe()
        );
        super.dispose();
    }

    call(C: CALL): Promise<CALL_RESULT> {
        return this.device.call(C);
    }

    getServices(): Service[] {
        return this.device.getServices();
    }

    findServiceFromType(type: string): Service {
        return this.device.findServiceFromType(type);
    }

    CallAction(serviceId: string, actionName: string, args: Object): Promise<CALL_RESULT> {
        return this.device.call( {serviceId, actionName, args} );
    }

    toJSON(): BrickUPnPJSON {
        return {
            ...super.toJSON(),
            deviceUPnP: this.device.toJSON()
        };
    }

}

