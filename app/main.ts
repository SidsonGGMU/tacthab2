import {app, emitOnSocketIO} from "./webServer/webServer";
import {RegisterTest} from "./test/test";
import {obsNewBrick} from "./Bricks/Brick";
import {CP} from "./Bricks/UPnP/ControlPoint";
import {socketBus} from "./Bricks/SocketBus/SocketBus";
import "./Bricks/CCBL/CcblRoot";
import "./Bricks/BLE/MetaWear";
import "./Bricks/Pipo/Pipo";
// import {BLEBridge} from "./Bricks/BLE/Bridge";

CP  .getObsDeviceAppears().subscribe(
    D => console.log("UPnP device", D.getType(), D.getUSN() )
);


app.get("/ping", (req, res) => {
    res.end("pong");
});

//
RegisterTest(app);

obsNewBrick.forEach( B => {
    B.obsEvents.forEach( evt => {
        // console.log("emitOnSocketIO", evt);
        emitOnSocketIO(B.getID(), evt);
    } );
});


/* SocketBus */
socketBus.getObsConnected().subscribe( c => emitOnSocketIO("socketBus::connected", c) );
socketBus.getObsMessage  ().subscribe( m => emitOnSocketIO("socketBus::message"  , m) );

import "./Bricks/BLE/BridgeFactory";
import "./Bricks/Weather/WeatherFactory";

// TEST :
/*
const bridge = new BLEBridge({name: "BLE test bridge", host: "192.168.1.28", port: "8880"});
console.log("Test BLE Bridge:", bridge.toJSON());
*/
import {connect} from "./dataBase/mongo";
connect();
