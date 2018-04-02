import {Observable} from "@reactivex/rxjs";

export interface BridgeInterface {
    getIsConnected(): {connected: boolean, obs: Observable<boolean>} ;
    call(c: {deviceId: string, method: string, arguments: any[]});
}