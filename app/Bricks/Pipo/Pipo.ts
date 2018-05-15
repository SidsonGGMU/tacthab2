import {Brick} from "../Brick";
import {BrickChannel, BrickEmitter} from "../CCBL/CcblDataStructures";
import {BehaviorSubject, Subject} from "@reactivex/rxjs";

let nb = 0;

export class BrickPipo extends Brick {
    // For channels
    chan1 = new BehaviorSubject<number>(0);

    // For emitters
    emit1 = new BehaviorSubject<number>(0);

    // For events
    evt1 = new Subject<number>();

    constructor() {
        super({name: `Pipo brick ${++nb} for test`});
        this.types.push("Pipo");

        const emitter1 = new BrickEmitter<number>({
            emitterName: "emitter1",
            type: "number",
            initialAccessor: () => this.emit1.getValue(),
            obsUpdate: this.emit1
        });
        this.brickEmitters.set(emitter1.emitterName, emitter1);

        const channel1 = new BrickChannel<number>({
            emitterName: "channel1",
            type: "number",
            initialAccessor: () => this.chan1.getValue(),
            obsUpdate: this.chan1,
            fctBrickUpdate: v => {
                if (v !== this.chan1.getValue()) {
                    this.chan1.next(v);
                }
            }
        });
        this.brickChannels.set(channel1.emitterName, channel1);

        let nbUpdateChannel1 = 0;
        this.chan1.subscribe( v => {
            console.log("channel1 updated with", v, "(update", ++nbUpdateChannel1, ")");
            this.subjectEvents.next({
                attribute: "channel1",
                data: v
            });
        });
        this.emit1.subscribe( v => this.subjectEvents.next({
            attribute: "emitter1",
            data: v
        }));
    }

    setEmitter1(v: number) {
        this.emit1.next(v);
    }

    setChannel1(v: number) {
        console.log("setChannel1", v);
        this.chan1.next(v);
    }

    triggerEvt1(v: number) {
        this.evt1.next(v);
    }

    toJSON() {
        return {
            ...super.toJSON(),
            emitter1: this.emit1.getValue(),
            channel1: this.chan1.getValue()
        };
    }
}


new BrickPipo();
new BrickPipo();
