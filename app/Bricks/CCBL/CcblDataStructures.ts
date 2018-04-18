import {Observable, Subscription} from "@reactivex/rxjs";
import {Channel} from "ccbl-js/Channel";
import {CCBLEmitterValueInterface} from "ccbl-js/EmitterValueInterface";
import {CCBLEmitterValue} from "ccbl-js/EmitterValue";

export type FunctionGetValue    <T> = () => T;
export type FunctionUpdateValue <T> = () => Observable<T>;

export interface ConfigBrickEmitter<T> {
    emitterName: string;
    type: string;
    initialAccessor: FunctionGetValue<T>;
    obsUpdate: Observable<T>;
}

export type BrickEmitterJSON = {
    name: string;
    type: string;
};

export class BrickEmitter<T> {
    protected _emitter: CCBLEmitterValueInterface<T>;

    private _emitterName: string;
    private _type: string;
    // private brickId: string;
    private initialAccessor: FunctionGetValue<T>;
    private obsUpdate: Observable<T>;
    private subscriptionToEmitter: Subscription;
    // private brick?: Brick;

    constructor(config: ConfigBrickEmitter<T>) {
        const {emitterName, initialAccessor, obsUpdate, type} = config;
        this._emitterName    = emitterName;
        this.initialAccessor = initialAccessor;
        this.obsUpdate       = obsUpdate;
        this._type           = type;
        this._emitter        = new CCBLEmitterValue<T>(undefined);
    }

    dispose() {
        if (this.subscriptionToEmitter) {
            this.subscriptionToEmitter.unsubscribe();
        }
        if (this.emitter) {
            this.emitter.dispose();
        }
    }

    get emitter(): CCBLEmitterValueInterface<T> {
        return this._emitter;
    }

    get emitterName(): string {
        return this._emitterName;
    }

    get type(): string {
        return this._type;
    }

    activate(act: boolean = true): this {
        if (!act && this.subscriptionToEmitter) {
            this.subscriptionToEmitter.unsubscribe();
        }
        if (act && !this.subscriptionToEmitter) {
            if (this.initialAccessor) {
                this.emitter.emit(this.initialAccessor());
            }
            this.subscriptionToEmitter = this.obsUpdate.subscribe(
                value => this.emitter.emit(value)
            );
        }
        return this;
    }

    toJSON(): BrickEmitterJSON {
        return {
            name: this.emitterName,
            type: this.type
        };
    }

}


export interface ConfigBrickChannel<T> extends ConfigBrickEmitter<T> {
    fctBrickUpdate: (value: T) => void;
}

export class BrickChannel<T> extends BrickEmitter<T> {
    private channel: Channel<T>;

    constructor(config: ConfigBrickChannel<T>) {
        super(config);
        /* Build the channel on top of the emitter ... ?
         * Subscribe to the channel emitter to update the brick accordingly
         * Plusieurs cas possibles à prendre en compte :
         *     - On utilise le channel en sortie exclusivement
         *       Dans ce cas il suffit de s'abonner aux modifications sur le channel
         *       et de les traduire en commandes pour la brique.
         *     - On utilise le channel à la fois en entrée et en sortie.
         *       Dans ce cas on prend en compte la possibilité que les utilisateurs
         *       mettent à jour le channel par d'autres moyens.
         *       Ca pourrait par exemple être le cas des lampes Philips qu'on peut mettre à jour
         *       directement via l'application dédiée.
         *       Se pose alors plusieurs la question de ce qui doit être fait dans ce cas :
         *         + On ignore la valeur venu de l'extérieur.
         *         + On prend en compte cette valeur et on la répercute dans CCBL
         *           Par exemple en disant que l'action courante sur la channel a été surchargée.
         *           Il se peut aussi tout simplement que cela soit le résultat de la mise à jour demandée.
         *           Cela peut être problématique si le channel varie à une fréquence élevée.
         *           Avoir une temporisation des demandes de changements (pas de nouvelle prise en compte
         *           tant qu'on a pas reçut accusé de réception de la précédente demande.
         *         + On insiste lourdement on ré-appliquant la modification demandée par CCBL
         *       Peut être faut il envisager que toutes ces options soient possible ???
         */
        const {fctBrickUpdate} = config;
        this.channel = new Channel<T>( this.emitter );
        this.channel.valueEmitter.on( fctBrickUpdate );
    }

    // Redefine what activate means ?
}