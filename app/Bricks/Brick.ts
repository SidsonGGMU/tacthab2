import {Subject, Observable} from "@reactivex/rxjs";
import {BrickChannel, BrickEmitter, BrickEmitterJSON} from "./CCBL/CcblDataStructures";

export type BRICK_ID = string;
export type BRICK_CONFIG = {
    name: string;
    id?: BRICK_ID;

};
export interface BrickJSON {
    id: BRICK_ID;
    name: string;
    types: string[];
    emitters: BrickEmitterJSON[];
    channels: BrickEmitterJSON[];
}

function* genId(): IterableIterator<string> {
    let i = 0;
    while (true) {
        yield `Brick::${i++}`;
    }
}

console.log("---> BRICK");

const getUID = genId();
const mapBrick = new Map<BRICK_ID, Brick>();

const subjectNewBrick = new Subject<Brick>();
export const obsNewBrick: Observable<Brick> = subjectNewBrick.asObservable();

const subjectDisposeBrick = new Subject<Brick>();
export const obsDisposeBrick: Observable<Brick> = subjectDisposeBrick.asObservable();

export type BrickEvent = {
    attribute: string,
    data: any
};

export abstract class Brick {
    obsEvents: Observable<BrickEvent>;

    protected types: string[] = [];

    protected brickEmitters = new Map<string, BrickEmitter<any>>();
    protected brickChannels = new Map<string, BrickChannel<any>>();

    protected subjectEvents = new Subject<BrickEvent>();
    private id: string;
    private name: string;

    constructor(config: BRICK_CONFIG) {
        this.id = config.id || getUID.next().value;
        this.name = config.name || this.id;
        this.types.push("Brick");
        this.obsEvents = this.subjectEvents.asObservable();
        if (mapBrick.has(this.id)) {
            throw {message: `Brick ID already in use`, brickId: this.id};
        } else {
            mapBrick.set(this.id, this);
            setTimeout( () => subjectNewBrick.next(this), 1);
        }
    }

    dispose() {
        mapBrick.delete(this.id);
        this.brickEmitters.forEach( BE => BE.activate(false) );
        this.brickChannels.forEach( CE => CE.activate(false) );
        setTimeout( () => subjectDisposeBrick.next(this), 1);
    }

    toJSON(): BrickJSON {
        return {
            name: this.getName(),
            id: this.getID(),
            types: this.types,
            emitters: [...this.brickEmitters.values()].map( B => B.toJSON() ),
            channels: [...this.brickChannels.values()].map( C => C.toJSON() )
        };
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): string {
        return this.name = name;
    }

    getID(): string {
        return this.id;
    }

    getTypes(): string[] {
        return this.types;
    }

    getObservableEvents(): Observable<BrickEvent> {
        return this.obsEvents;
    }

    getBrickEmitter(name: string): BrickEmitter<any> {
        return this.brickEmitters.get(name);
    }

}

export function getBrickFromId(id: string): Brick {
    return mapBrick.get(id);
}

export function getBricks(): Brick[] {
    return [ ...mapBrick.values() ];
}

