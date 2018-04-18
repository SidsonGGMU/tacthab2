import {Brick, BrickEvent, BrickJSON} from "../Brick";
import {HueBridge} from "./HueBridge";
import {Observable} from "@reactivex/rxjs";
import {BrickChannel} from "../CCBL/CcblDataStructures";
import {getHSLColor} from "./HueColors";

export type ChannelState = string;

export class HueLamp extends Brick {
    private obsState: Observable<ChannelState>;
    private hueColor: string;

    constructor(private bridge: HueBridge, private lampId: string, private data: LampDescription) {
        super({name: data.name, id: data.uniqueid});
        this.types.push("HueLamp");

        // Configure observable for Hue state
        this.obsState = this.getObservableEvents()
                            .filter( (evt: BrickEvent) => evt.attribute === "state" )
                            .map( () => this.getLampState() );

        // Configure setter for Hue state
        const channelState = new BrickChannel<ChannelState>({
            emitterName: "state",
            type: "off | colorName | hsl(0-365, 0-100%, 0-100%)",
            initialAccessor: () => this.getLampState(),
            obsUpdate: this.obsState,
            fctBrickUpdate: (value: ChannelState) => this.setLampState(value)
        });

        this.brickChannels.set( channelState.emitterName, channelState);
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

    getLampState(): ChannelState {
        if (this.isOn()) {
            const hue = Math.round( this.data.state.hue / 65565 * 365 );
            const sat = Math.round( this.data.state.sat / 255   * 100 );
            const bri = Math.round( this.data.state.bri / 255   * 100 );
            this.hueColor = this.hueColor || `hsl(${hue}, ${sat}%, ${bri}%)`;
            return this.hueColor ;
        } else {
            return "off";
        }
    }

    async setLampState(state: ChannelState) {
        if (state === "off") {
        } else {
            const {hue, sat, bri} = getHSLColor(state);
            this.hueColor = state;
            return this.setState( {
                on: true,
                bri: bri *   255 / 100,
                sat: sat *   255 / 100,
                hue: hue * 65535 / 365
            } );
        }
    }

    async setState(state: LampStateSetter) {
        // send command to the bridge
        const delta: [string, any][] = await this.bridge.setLampState(this, state);
        // delta.forEach( ([k, v]) => this.data.state[k] = v );
        return this.updateStateFromDelta(delta);
    }

    updateStateFromState(newState: LampState) {
        const delta = [];
        for (let k in newState) {
            delta.push( [k, newState[k]] );
        }
        this.updateStateFromDelta(delta);
    }

    updateStateFromDelta(delta: [string, any][]): [string, any][] {
        const modifications = delta.filter(([k, v]) => {
            if (v.constructor === Array) {
                return v.reduce( (acc, value, i) => acc || value !== this.data.state[k][i], false);
            } else {
                return this.data.state[k] !== v;
            }
        });
        modifications.forEach( ([k, v]) => this.data.state[k] = v );
        if (modifications.length) {
            // console.log("emit state", modifications);
            this.subjectEvents.next({
                attribute: "state",
                data: modifications
            });
        }
        return modifications;
    }

    toJSON(): LampJson {
        return {...super.toJSON(), ...this.data};
    }


}

export interface LampState {
    on: boolean;
    bri: number; // 1 to 254
    hue: number; // 0 to 65535(red) 25500(green) 46920(blue)
    sat: number; // 0 to 254
    effect: string; // 'none',
    xy: [number, number]; // [ 0, 0 ],
    ct: number; // 0,
    alert: string; // 'none',
    colormode: "hs" | "xy"; // 'hs',
    reachable: boolean; // false
}

export interface LampStateSetter {
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

export interface LampDescription {
    state: LampState;
    type: string; // 'Extended color light',
    name: string; // 'MK1',
    modelid: string; // 'LCT001',
    manufacturername: string; // 'Philips',
    uniqueid: string; // '00:17:88:01:00:b2:27:3a-0b',
    swversion: string; // '66013452',
    pointsymbol: any; // voir [Object],
}

export interface LampJson extends LampDescription, BrickJSON {}