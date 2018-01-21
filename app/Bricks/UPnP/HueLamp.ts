import {Brick, BrickJSON} from "../Brick";
import {HueBridge} from "./HueBridge";

export class HueLamp extends Brick {

    constructor(private bridge: HueBridge, private lampId: string, private data: LAMP_DESCRIPTION) {
        super({name: data.name, id: data.uniqueid});
        this.types.push("HueLamp");
    }

    isReachable(): boolean {
        return this.data.state.reachable;
    }

    getName(): string {
        return this.data.name;
    }

    getLampId(): string {
        return this.lampId;
    }

    getSoftVersion(): string {
        return this.data.swversion;
    }

    isOn(): boolean {
        return this.data.state.on;
    }

    async setState(state: LAMP_STATE_SETTER) {
        // send command to the bridge
        const delta: [string, any][] = await this.bridge.setLampState(this, state);
        delta.forEach( ([k, v]) => this.data.state[k] = v );
        // console.log("setState =>", this.data.state);
        return delta;
    }

    updateStateFromState(newState: LAMP_STATE) {
        const delta = [];
        for (let k in newState) {
            delta.push( [k, newState[k]] );
        }
        this.updateStateFromDelta(delta);
    }

    updateStateFromDelta(delta: [string, any][]) {
        const modifications = delta.filter(([k, v]) => {
            if (v.constructor === Array) {
                return v.reduce( (acc, value, i) => acc || value !== this.data.state[k][i], false);
            } else {
                return this.data.state[k] !== v;
            }
        });
        modifications.forEach( ([k, v]) => this.data.state[k] = v );
        /*if (modifications.length) {
            console.log(this.getLampId(), "updateState =>", modifications);
        }*/
    }

    toJSON(): LAMP_JSON {
        return {...super.toJSON(), ...this.data};
    }

}

export interface LAMP_STATE {
    on: boolean;
    bri: number; // 1 to 254
    hue: number; // 0 to 65535(red) 25500(green) 46920(blue)
    sat: number; // 0 to 254
    effect: string; // 'none',
    xy: [number, number]; // [ 0, 0 ],
    ct: number; // 0,
    alert: string; // 'none',
    colormode: "hs" | "xy"; // 'hs',
    reachable: boolean; //false
}

export interface LAMP_STATE_SETTER {
    on?: boolean;
    bri?: number; // 1 to 254
    hue?: number; // 0 to 65535(red) 25500(green) 46920(blue)
    sat?: number; // 0 to 254
    xy?: [number, number];
    ct?: number;
    alert?: "none" | "select" | "lselect";
    effect?: "none" | "colorloop";
    transitiontime?: number; // in x100ms, default: 4
}

export interface LAMP_DESCRIPTION {
    state: LAMP_STATE;
    type: string; // 'Extended color light',
    name: string; // 'MK1',
    modelid: string; // 'LCT001',
    manufacturername: string; // 'Philips',
    uniqueid: string; // '00:17:88:01:00:b2:27:3a-0b',
    swversion: string; // '66013452',
    pointsymbol: any; // voir [Object],
}

export interface LAMP_JSON extends LAMP_DESCRIPTION, BrickJSON {}