import {Brick, getBrickFromId, obsDisposeBrick, obsNewBrick} from "../Brick";
import {CCBLEnvironmentExecution} from "ccbl-js/ExecutionEnvironment";
import {CCBLSystemClock, CCBLTestClock} from "ccbl-js/Clock";
import {CCBLEnvironmentExecutionInterface} from "ccbl-js/ExecutionEnvironmentInterface";
import {CCBLProgramObjectInterface} from "ccbl-js/ProgramObjectInterface";
import {CCBLProgramObject} from "ccbl-js/ProgramObject";
import {CCBLEmitterValue} from "ccbl-js/EmitterValue";
import {BrickEmitter} from "./CcblDataStructures";

const sysClock = new CCBLSystemClock();

type BrickEmitterForCCBL<T> = {
    brickId: string;
    emitterName: string;
    brick?: Brick;
    emitter?: CCBLEmitterValue<T>;
    cb?: (value: T) => void;
};

// This is used to encapsulate a CCBL program (root) and provide access to others bricks of the system
export class BrickCcblRoot extends Brick {
    private clock = new CCBLTestClock();
    private environment: CCBLEnvironmentExecutionInterface;
    private rootProg: CCBLProgramObjectInterface;

    private brickEmitterForCCBL: BrickEmitterForCCBL<any>[] = [];

    constructor(config: {name: string, whiteList: string[]}) { // Access rights... ?
        super(config);
        this.synchronizeClockWithSystemClock();
        this.environment = new CCBLEnvironmentExecution( this.clock );
        this.rootProg = new CCBLProgramObject(name, this.clock);
    }

    getRootProgram(): CCBLProgramObjectInterface {
        return this.rootProg;
    }

    synchronizeClockWithSystemClock() {
        this.clock.goto( sysClock.now() );
    }

    registerEmitter<T>(be: BrickEmitterForCCBL<T>) {
        const {emitterName, brickId} = be;
        this.brickEmitterForCCBL.push( be );

        // Is the brick present ? Publish an emitter for that.
        be.brick    = getBrickFromId( brickId );
        be.emitter  = new CCBLEmitterValue<T>(undefined);
        be.emitter.setIsAvailable( !!be.brick );
        be.cb = v => be.emitter.emit(v);

        obsDisposeBrick.filter( (B: Brick) => B.getID() === brickId ).subscribe( () => this.disableEmitter<T>(be) );
        obsNewBrick    .filter( (B: Brick) => B.getID() === brickId ).subscribe( () => this.enableEmitter<T>(be.brick, be) );

        this.environment.register_CCBLEmitterValue(emitterName, be.emitter);

        if (be.brick) {
            this.enableEmitter(be.brick, be);
        }

    }

    private enableEmitter<T>(brick: Brick, be: BrickEmitterForCCBL<T>) {
        be.brick = brick;
        const brickEmitter: BrickEmitter<T> = brick.getBrickEmitter( be.emitterName );

        brickEmitter.emitter.on( be.cb );
        brickEmitter.activate();

        be.emitter.setIsAvailable(true);
    }

    private disableEmitter<T>(be: BrickEmitterForCCBL<T>) {
        be.emitter.setIsAvailable(false);
        be.brick = undefined;
    }

}