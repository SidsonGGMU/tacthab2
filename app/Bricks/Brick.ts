import {Subject, Observable} from "@reactivex/rxjs";

export type BRICK_ID = string;
export type BRICK_CONFIG = {
    name: string;
    id?: BRICK_ID;

};
export interface BrickJSON {
    id: BRICK_ID;
    name: string;
    types: string[];
}

function* genId(): IterableIterator<string> {
    let i = 0;
    while (true) {
        yield `Brick::${i}`;
    }
}

const getUID = genId();
const mapBrick = new Map<BRICK_ID, Brick>();

const subjectNewBrick = new Subject<Brick>();
export const obsNewBrick: Observable<Brick> = subjectNewBrick.asObservable();

const subjectDisposeBrick = new Subject<Brick>();
export const obsDisposerick: Observable<Brick> = subjectDisposeBrick.asObservable();

type BrickEvent = {
    attribute: string,
    data: any
};

export abstract class Brick {
    obsEvents: Observable<BrickEvent>;
    protected types: string[] = [];
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
        setTimeout( () => subjectDisposeBrick.next(this), 1);
    }

    toJSON(): BrickJSON {
        return {
            name: this.getName(),
            id: this.getID(),
            types: this.types
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
}

export function getBrickFromId(id: string): Brick {
    return mapBrick.get(id);
}

export function getBricks(): Brick[] {
    return [ ...mapBrick.values() ];
}

