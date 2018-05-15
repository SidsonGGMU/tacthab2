import {Brick, BrickJSON, getBrickFromId, obsDisposeBrick, obsNewBrick} from "../Brick";
import {CCBLEnvironmentExecution} from "ccbl-js/ExecutionEnvironment";
import {CCBLSystemClock, CCBLTestClock} from "ccbl-js/Clock";
import {CCBLEnvironmentExecutionInterface} from "ccbl-js/ExecutionEnvironmentInterface";
import {CCBLProgramObjectInterface} from "ccbl-js/ProgramObjectInterface";
import {CCBLProgramObject} from "ccbl-js/ProgramObject";
import {CCBLEmitterValue} from "ccbl-js/EmitterValue";
import {BrickEmitter} from "./CcblDataStructures";
import {CCBL_EventJSON} from "ccbl-js/EventInterface";
import {ChannelJSON} from "ccbl-js/ChannelInterface";
import {CCBLEmitterValueJSON} from "ccbl-js/EmitterValueInterface";
import {Channel} from "ccbl-js/Channel";

const sysClock = new CCBLSystemClock();

type BrickEmitterDef = {
    brickId: string;
    emitterName: string;
    nameInCcbl: string;
};

type BrickEmitterForCCBL<T> = BrickEmitterDef & {
    brick?: Brick;
    emitter?: CCBLEmitterValue<T>;
    cb?: (value: T) => void;
};

type BrickChannelDef = {
    brickId: string;
    channelName: string;
    nameInCcbl: string;
    initialValue: string;
};

type BrickChannelForCCBL<T> = BrickChannelDef & {
    brick?: Brick;
    emitter?: CCBLEmitterValue<T>;
    channel?: Channel<T>;
    cbBrickUpdateChannel?: (value: T) => void;
    cbChannelUpdateBrick?: (value: T) => void;
};


type BrickCcblRootJSON_event = {
    brick: {
        id: string;
        eventerName: string;
    };
    ccbl: {
        name: string;
        value: any;
        description: CCBL_EventJSON
    };
};

type BrickCcblRootJSON_emitter = {
    brick: {
        id: string;
        emitterName: string;
    };
    ccbl: {
        name: string;
        value: any;
        description: CCBLEmitterValueJSON
    };
};

type BrickCcblRootJSON_channel = {
    brick: {
        id: string;
        channelName: string;
    };
    ccbl: {
        name: string;
        value: any;
        initialValue: any;
        description: ChannelJSON;
    };
};

export interface CcblRootJSON {
    env: {
        events:   BrickCcblRootJSON_event  [];
        emitters: BrickCcblRootJSON_emitter[];
        channels: BrickCcblRootJSON_channel[];
    };
}

export interface BrickCcblRootJSON extends BrickJSON, CcblRootJSON {
}

// This is used to encapsulate a CCBL program (root) and provide access to others bricks of the system
export class BrickCcblRoot extends Brick {
    private clock = new CCBLTestClock();
    private environment: CCBLEnvironmentExecutionInterface;
    private rootProg: CCBLProgramObjectInterface;

    private brickEmitterForCCBL: BrickEmitterForCCBL<any>[] = [];
    private brickChannelForCCBL: BrickChannelForCCBL<any>[] = [];

    constructor(config: {name: string, whiteList: string[]}) { // Access rights... ?
        super(config);
        this.types.push("CcblRoot");
        this.synchronizeClockWithSystemClock();
        this.environment = new CCBLEnvironmentExecution( this.clock );
        this.rootProg = new CCBLProgramObject(name, this.clock);
    }

    toJSON(): BrickCcblRootJSON {
        return {
            ...super.toJSON(),
            // program: undefined,
            env: {
                events: [],
                emitters: this.brickEmitterForCCBL.map(be => ({
                    brick: {
                        id: be.brickId,
                        emitterName: be.emitterName
                    },
                    ccbl: {
                        name: be.nameInCcbl,
                        value: be.emitter.get(),
                        description: be.emitter.toJSON()
                    }
                })),
                channels: this.brickChannelForCCBL.map(bc => ({
                    brick: {
                        id: bc.brickId,
                        channelName: bc.channelName
                    },
                    ccbl: {
                        name: bc.nameInCcbl,
                        value: bc.emitter.get(),
                        initialValue: bc.initialValue,
                        description: bc.channel.toJSON()
                    }
                }))
            }
            // env: this.environment.toJSON() // XXX Environment should be serializable
        };
    }

    loadJSON(descr: CcblRootJSON) {
        descr.env.emitters.forEach( eD =>
            this.registerEmitter(eD.ccbl.name, {
                brickId: eD.brick.id,
                emitterName: eD.brick.emitterName,
                nameInCcbl: eD.ccbl.name
            })
        );
        descr.env.channels.forEach( eC =>
            this.registerChannel(eC.ccbl.name, {
                brickId: eC.brick.id,
                channelName: eC.brick.channelName,
                nameInCcbl: eC.ccbl.name,
                initialValue: eC.ccbl.initialValue
            } )
        );
    }

    getRootProgram(): CCBLProgramObjectInterface {
        return this.rootProg;
    }

    synchronizeClockWithSystemClock() {
        this.clock.goto( sysClock.now() );
    }

    registerEmitter<T>(nameInCcbl: string, beDef: BrickEmitterDef): void {
        const {brickId} = beDef;
        const be: BrickEmitterForCCBL<T> = {...beDef, nameInCcbl};
        this.brickEmitterForCCBL.push( be );

        // Is the brick present ? Publish an emitter for that.
        be.brick    = getBrickFromId( brickId );
        be.emitter  = new CCBLEmitterValue<T>(undefined);
        be.emitter.setIsAvailable( !!be.brick );
        be.cb = v => be.emitter.emit(v);

        obsDisposeBrick.filter( (B: Brick) => B.getID() === brickId ).subscribe( () => this.disableEmitter<T>(be) );
        obsNewBrick    .filter( (B: Brick) => B.getID() === brickId ).subscribe( () => this.enableEmitter<T>(be.brick, be) );

        this.environment.register_CCBLEmitterValue(nameInCcbl, be.emitter);

        if (be.brick) {
            this.enableEmitter(be.brick, be);
        }

        this.subjectEvents.next({
            attribute: "env",
            data: this.toJSON().env
        });

    }

    // Channels
    registerChannel<T>(nameInCcbl: string, bcDef: BrickChannelDef): void {
        const {brickId} = bcDef;
        const bc: BrickChannelForCCBL<T> = {...bcDef, nameInCcbl};
        this.brickChannelForCCBL.push( bc );

        // Is the brick present ? Publish an emitter for that.
        bc.brick    = getBrickFromId( brickId );
        bc.emitter  = new CCBLEmitterValue<T>(undefined);
        bc.channel  = new Channel<T>(bc.emitter);
        bc.channel.setIsAvailable( !!bc.brick );
        bc.cbBrickUpdateChannel = v => bc.emitter.emit(v);

        obsDisposeBrick.filter( (B: Brick) => B.getID() === brickId ).subscribe( () => this.disableChannel<T>(bc) );
        obsNewBrick    .filter( (B: Brick) => B.getID() === brickId ).subscribe( () => this.enableChannel<T>(bc.brick, bc) );

        this.environment.register_Channel(nameInCcbl, bc.channel);


        if (bc.brick) {
            this.enableChannel(bc.brick, bc);
        }

        this.subjectEvents.next({
            attribute: "env",
            data: this.toJSON().env
        });

    }

    // -------------------------------------------------------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------------------------
    private enableEmitter<T>(brick: Brick, be: BrickEmitterForCCBL<T>) {
        be.brick = brick;
        const brickEmitter: BrickEmitter<T> = brick.getBrickEmitter( be.emitterName ) || brick.getBrickChannel( be.emitterName );

        brickEmitter.emitter.on( be.cb );
        brickEmitter.activate();

        be.emitter.setIsAvailable(true);
    }

    private disableEmitter<T>(be: BrickEmitterForCCBL<T>) {
        be.emitter.setIsAvailable(false);
        be.brick = undefined;
    }

    // -------------------------------------------------------------------------------------------------------------------------------------
    private enableChannel<T>(brick: Brick, bc: BrickChannelForCCBL<T>) {
        bc.brick = brick;
        const brickChannel: BrickEmitter<T> = brick.getBrickChannel( bc.channelName );

        brickChannel.emitter.on( bc.cbBrickUpdateChannel );
        brickChannel.activate();
        // XXX case channel update brick

        bc.channel.setIsAvailable(true);
    }

    private disableChannel<T>(bc: BrickChannelForCCBL<T>) {
        bc.channel.setIsAvailable(false);
        bc.brick = undefined;
    }

}



class BrickCcblRootFactory extends Brick {
    constructor(id: string = "BrickCcblRootFactory") {
        super({id, name: "CCBL root factory"});
        this.types.push( "CcblRootFactory" );
    }

    createCcblRoot(config: {name: string, whiteList: string[]}): string {
        const cr = new BrickCcblRoot(config);
        return cr.getID();
    }

}

new BrickCcblRootFactory();
