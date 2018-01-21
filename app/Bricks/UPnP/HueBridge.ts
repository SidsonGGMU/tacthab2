// import {Brick} from "../Brick";
import * as request from "request-promise-native";
import {BrickUPnP, BrickUPnPJSON} from "./BrickUPnP";
import {Device} from "alx-upnp";
import {HueLamp, LAMP_JSON, LAMP_STATE, LAMP_STATE_SETTER} from "./HueLamp";

export class HueBridge extends BrickUPnP {
    lamps: {
        [key: string]: HueLamp
    } = {};
    deviceAvailable = false;
    authorizedConnection = false;
    private timer: any;
    private timerUpdate: any;
    private baseURL: string;
    private userName: string = "18b3c6ee1080cee75cbc20228cff50b";
    private description: HUE_BRIDGE_DESCRIPTION;
    private dtUpdateStateFromBridge = 1000;

    constructor(protected device: Device) {
        super(device);
        this.types.push("HueBridge");
        this.baseURL = device.toJSON().baseURL;
        this.connect();
    }

    async connect() {
        const user = "18b3c6ee1080cee75cbc20228cff50b";
        const baseURL = this.device.toJSON().baseURL;
        try {
            const res = await request.get(`${baseURL}/api/${user}`);
            // console.log("HueBridge connect", typeof res, res);
            const objRes = JSON.parse(res);
            // console.log(typeof objRes);
            this.deviceAvailable = true;
            if (objRes.length && objRes[0].error && objRes[0].error.type === 1) {
                // unauthorized user
                const [resIdentify] = await request.post({
                    url: `${baseURL}/api`, // self.prefixHTTP + '/api',
                    method: "POST",
                    body: '{"devicetype":"TActHabv2#server"}'
                }).then( data => JSON.parse( data ) );
                console.log("HueBridge identification:", resIdentify);
                if (resIdentify.error) {
                    // link button not pressed
                    let message = JSON.stringify(resIdentify.error);
                    if (resIdentify.error.type === 101) {
                        message = "link button not pressed";
                    }
                    throw message;
                }
                if (resIdentify && resIdentify.success) {
                    console.log("Connected to Hue bridge !", resIdentify.success);
                    // { success: { username: '18b3c6ee1080cee75cbc20228cff50b' } }
                    this.setUserName( resIdentify.success.username );
                    this.authorizedConnection = true;
                }
            } else {
                console.log("Connected to Hue bridge !"); // , objRes);
                this.authorizedConnection = true;
                this.initLamps( objRes );
            }
        } catch (err) {
            // Problème de connection ?
            console.log("HueBridge connect error:", err);
            this.deviceAvailable = false;
            this.timer = setTimeout( () => this.connect(), 5000);
        }
    }

    dispose() {
        super.dispose();
        clearTimeout( this.timer );
        clearTimeout( this.timerUpdate );
    }

    toJSON(): HUE_BRIDGE_JSON {
        return {...super.toJSON(), ...this.description};
    }

    initLamps(description: HUE_BRIDGE_DESCRIPTION) {
        this.description = description;
        for (let id in description.lights) {
            const descr = description.lights[id];
            const lamp = new HueLamp(this, id, descr);
            this.lamps[id] = lamp;
            if (lamp.isReachable()) {
                lamp.setState({
                    on: true,
                    hue: 46920,
                    sat: 254,
                    bri: 32
                });
            }
        }
        this.timerUpdate = setTimeout( () => this.updateLamps() );
    }

    getdtUpdateStateFromBridge(): number {
        return this.dtUpdateStateFromBridge;
    }

    setdtUpdateStateFromBridge(dt: number): void {
        this.dtUpdateStateFromBridge = dt;
    }

    updateLamps() {
        request.get(`${this.baseURL}/api/${this.userName}/lights`).then( str => {
            const objRes = JSON.parse(str);
            for (let idLamp in objRes) {
                const lamp = this.lamps[idLamp];
                lamp.updateStateFromState( objRes[idLamp].state as LAMP_STATE );
            }
            setTimeout( () => this.updateLamps(), this.dtUpdateStateFromBridge);
        }).catch( err => {
            console.error("Error getting lamps state from HueBridge");
        });
    }

    setLampState(lamp: HueLamp, state: LAMP_STATE_SETTER): Promise<[string, any][]> {
        // PUT on /api/<username>/lights/<id>/state
        return request({
            uri: `${this.baseURL}/api/${this.userName}/lights/${lamp.getLampId()}/state`,
            method: "PUT",
            body: JSON.stringify(state)
        }).then((str_res: string) => {
            const L_res: STATE_RES[] = JSON.parse(str_res);
            // console.log("setState", state, "=>", L_res);
            const delta = L_res .filter(res => res.success)
                                .map( res => {
                                    const key     = Object.keys(res.success)[0];
                                    const L_att   = key.split("/");
                                    const varName = L_att[ L_att.length - 1 ];
                                    return [varName, res.success[key]];
                                });
            console.log(delta);
            return delta;
        });
    }

    private setUserName(name: string) {
        this.userName = name;
    }
}

type STATE_RES = {
    error?: string;
    success?: {
        [key: string]: any
    }
}

export function instantiateHueBridge(device: Device): boolean {
    if (device.toJSON().modelDescription.indexOf("Philips hue") >= 0) {
        new HueBridge(device);
        return true;
    } else {
        return false;
    }
}

export interface HUE_BRIDGE_JSON extends BrickUPnPJSON, HUE_BRIDGE_DESCRIPTION {}

export interface HUE_BRIDGE_DESCRIPTION {
    lights: {
        [key: string]: LAMP_JSON;
    };
    groups: any;
    config: {
        name: string; // 'Philips hue',
        zigbeechannel: number; // 11,
        mac: string; // '00:17:88:0a:99:c1',
        dhcp: boolean; // true,
        ipaddress: string; // '192.168.1.11',
        netmask: string; // '255.255.255.0',
        gateway: string; // '192.168.1.1',
        proxyaddress: string; // 'none',
        proxyport: number; // 0,
        UTC: string; // '2018-01-21T11:36:37',
        localtime: string; // '2018-01-21T12:36:37',
        timezone: string; // 'Europe/Paris',
        whitelist: any[]; // XXX
    };
    swversion: string; // '01023599',
    apiversion: string; // '1.7.0',
    swupdate:{
        updatestate: number; // 2,
        checkforupdate: boolean; // false,
        devicetypes: any[]; // [Object],
        url: string; // '',
        text: string; // 'BSB001 - 01038802',
        notify: boolean; // false
    };
    linkbutton: boolean; // false,
    portalservices: boolean; // true,
    portalconnection: string; // 'connected',
    portalstate: {
        signedon: boolean; // true,
        incoming: boolean; // true,
        outgoing: boolean; // true,
        communication: string; // 'disconnected'
    };
    schedules: any; // {},
    scenes: {
        [key: string]: {
            name: string; // 'Pencils on 1425578271418',
            lights: any[]; // ...
            active: boolean;
        };
    };
    rules: any;
    sensors: {
        [key: string]: {
            state: any; // [Object],
            config: any; // [Object],
            name: string; // 'Daylight',
            type: string; // 'Daylight',
            modelid: string; // 'PHDL00',
            manufacturername: string; // 'Philips',
            swversion: string; // '1.0'
        };
    };
}
