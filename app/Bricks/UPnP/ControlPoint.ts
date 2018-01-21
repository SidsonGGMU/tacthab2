import {getControlPoint} from "alx-upnp";
import {getBrickFromId} from "../Brick";
import {BrickUPnP} from "./BrickUPnP";
import {instantiateMediaRenderer} from "./MediaRenderer";
import {instantiateMediaServer}   from "./MediaServer";
import {instantiateHueBridge} from "./HueBridge";

export const CP = getControlPoint();
// CP.getObsDeviceAppears()

CP  .getObsDeviceAppears()
    .filter( D => !instantiateMediaServer  (D) )
    .filter( D => !instantiateMediaRenderer(D) )
    .filter( D => !instantiateHueBridge    (D) )
    .forEach( D => new BrickUPnP(D) );

CP  .getObsDeviceDisappears()
    .forEach( D => {
        console.log("device disappears", D.getUSN());
        const brick = getBrickFromId(D.getUSN());
        if (brick) {
            console.log("dispose brick", brick.getID());
            brick.dispose();
        }
    });
