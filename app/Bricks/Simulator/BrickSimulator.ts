import {Brick} from "../Brick";
import "socket.io";
import {BrickChannel, BrickEmitter} from "../CCBL/CcblDataStructures";
import {Subject} from "@reactivex/rxjs";

let sid = 0;
const sims: BrickSimulator[] = [];
export function getSimulatorFromName(name: string): BrickSimulator {
    return sims.find( S => S.getName() === name );
}

export class BrickSimulator extends Brick {
    private subjectsEmitters = new Map<string, Subject<any>>();
    private socket: SocketIO.Socket;


    constructor(socket: SocketIO.Socket, initialDescription: InitialDescription) {
        super({id: `Simulator::${++sid}`, name: initialDescription.simulatedEnvironmentName});
        sims.push(this);

        // Create channels, emitters and eventers...
        initialDescription.channels.forEach( ({id, type, value}) => {
            this.subjectsEmitters.set(id, new Subject<any>());
            this.brickChannels.set(id, new BrickChannel<any>({
                emitterName: id,
                type,
                initialAccessor: () => value,
                obsUpdate: this.subjectsEmitters.get(id).asObservable(),
                fctBrickUpdate: (v: any) => this.emit("updateChannel", {id, value: v} as Update)
            }) );
        });
        initialDescription.emitters.forEach( ({id, type, value}) => {
            this.subjectsEmitters.set(id, new Subject<any>());
            this.brickEmitters.set(id, new BrickEmitter<any>({
                emitterName: id,
                type,
                initialAccessor: () => value,
                obsUpdate: this.subjectsEmitters.get(id).asObservable()
            }) );
        });

        // Subscribe to events
        this.updateSocket(socket);
    }

    updateSocket(socket: SocketIO.Socket) {
        this.socket = socket;
        socket.on("updateChannel", (channelUpdate: Update) => {
            console.error(`NOT SUPPORTED BY NOW, SHOULD BE WHEN CONSIDERING OVERLOADING BY USER VIA EXTERNAL PROGRAM
                            (e.g. Hue lamps application)`);
        } );
        socket.on("updateEmitter", ({id, value}: Update) => {
            this.subjectsEmitters.get(id).next(value);
        } );
        socket.on("triggerEvent", ({id, value}: Update) => {
            this.subjectsEmitters.get(id).next(value);
        } );
    }

    emit(event: string, data: any) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

}

export type InitialDescription = {
    simulatedEnvironmentName: string;
    channels: ChannelOrEmitterInitialDescription[];
    emitters: ChannelOrEmitterInitialDescription[];
    eventers: EventerInitialDescription[];
};

type ChannelOrEmitterInitialDescription = {
    id: string;
    type: string;
    value: any;
};

type EventerInitialDescription = {
    id: string;
    type: string;
};

type Update = {
    id: string;
    value: any;
};

