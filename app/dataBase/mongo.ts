import * as mongoose from "mongoose";
import {Observable, BehaviorSubject} from "@reactivex/rxjs";

const subjIsConnected = new BehaviorSubject<boolean>(false);
export function isConnected(): Observable<boolean> {
    return subjIsConnected.asObservable();
}


export function connect(user?: string, pass?: string, path?: string): Promise<boolean> {
    const mongoUser     = user || "TActHab2";
    const mongoPW       = pass || "hehehe";
    const mongoPpath    = path || "ds211588.mlab.com:11588/tacthab2";

    return mongoose.connect(`mongodb://${mongoUser}:${mongoPW}@${mongoPpath}`).then(
        () => {
            subjIsConnected.next(true);
            console.log("Connected to mongoDB...");
            return true;
        },
        (err) => {
            console.error("Error connecting to mongo", err);
            return false;
        }
    );
}

