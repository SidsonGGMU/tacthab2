const sectionDevices = document.querySelector("section.devices");
const sectionTabs = document.querySelector("section.tabs");

let allBricks = [];

function getBricks() {
    sio.emit("call", {command: "getBricks"}, bricks => {
        allBricks = bricks.success;
        console.log("getBricks =>", bricks);
        bricks.success.filter( B => B.types.indexOf("MediaRenderer") >= 0 ).forEach( B => {
            createMediaRenderer(B);
        });
    });
}

function Browse(section, MS_id, containerID, MR_id) {
    sio.emit("call", {
            command: "BrickCall",
            call: {
                brickId: MS_id,
                method: "Browse",
                args: [containerID, "BrowseDirectChildren"]
            }
        },
        res => {
            console.log("Browse =>", res);
            section.textContent = "";
            // Populate section.
            if (res.success) {
                const containers = res.success.containers;
                containers.forEach( C => {
                    const sectionContainer = document.createElement("section");
                    sectionContainer.classList.add("container");
                    sectionContainer.textContent = C.title;
                    section.appendChild(sectionContainer);
                    sectionContainer.onclick = () => {
                        Browse(section, MS_id, C.id, MR_id);
                    }
                });

                const items = res.success.items;
                items.forEach( I => {
                    const sectionItem = document.createElement("section");
                    sectionItem.classList.add("item");
                    sectionItem.textContent = `==> ${I.title}`;
                    section.appendChild(sectionItem);
                    sectionItem.onclick = () => {
                        sio.emit("call", {
                                command: "BrickCall",
                                call: {
                                    brickId: MR_id,
                                    method: "loadMedia",
                                    args: [MS_id, I.id]
                                }
                            },
                            res => console.log("loadMedia =>", res)
                        );
                    }
                });

            }
        }
    );
}

function createMediaRenderer(B) {
    const section = document.createElement("section");
    section.classList.add("MediaRenderer");
    section.innerHTML = `
        <h3></h3>
        <section class="commands">
            <button class="play">PLAY</button>
            <button class="pause">PAUSE</button>
            <button class="stop">STOP</button>
        </section>
        <section class="Browse">
        </section>
        <section class="stateVariables">
        </section>
    `;

    const title = section.querySelector("h3");
    title.textContent = `Renderer ${B.name} (${B.id})`;

    const sectionBrowse = section.querySelector( "section.Browse" );
    // Gérer la navigation dans la section browse...
    // Lister au premier niveau les MediaServer
    allBricks.filter( BMS => BMS.types.indexOf("MediaServer") >= 0 ).forEach( BMS => {
        const sectionMS = document.createElement("section");
        sectionMS.classList.add("MediaServer");
        sectionMS.textContent = `${BMS.name} (${BMS.id})`;
        sectionMS.onclick = () => Browse(sectionBrowse, BMS.id, "0", B.id);
        sectionBrowse.appendChild( sectionMS );
    });

    const stateVariables = section.querySelector("section.stateVariables");
    B.deviceUPnP.services.forEach( S => {
        const sid = S.serviceId;
        const sectionSrv = document.createElement("section");
        sectionSrv.classList.add("service");
        sectionSrv.classList.add( ...sid.split(":") );
        stateVariables.appendChild( sectionSrv );
        sectionSrv.innerHTML = `<h4>${sid}</h4>`;
        S.stateVariables.forEach( SV => {
            if(SV.name !== "LastChange") {
                const sectionSV = document.createElement("section");
                sectionSV.classList.add("stateVariable");
                sectionSV.classList.add(SV.name);
                sectionSV.textContent = `${SV.name} : ${SV.value}`;
                sectionSrv.appendChild(sectionSV);
            }
        });
    });

    const btPlay  = section.querySelector("section.commands > button.play" );
    const btPause = section.querySelector("section.commands > button.pause");
    const btStop  = section.querySelector("section.commands > button.stop" );

    function PPS(command) {
        sio.emit("call", {
                command: "BrickCall",
                call: {
                    brickId: B.id,
                    method: command,
                    args: []
                }
            },
            res => console.log("command =>", res)
        );
    }
    btPlay.onclick = () => {
        console.log("play", B.name);
        PPS("play");
    };

    btPause.onclick = () => {
        console.log("pause", B.name);
        PPS("pause");
    };

    btStop.onclick = () => {
        console.log("stop", B.name);
        PPS("stop");
    };

    sio.on(B.id, evt => {
        console.log(B.id, "=>", evt);
        const sel = `.${evt.attribute} > .${evt.data.stateVariable}`;
        const sectionSV = stateVariables.querySelector(sel);
        console.log(sel, "=>", sectionSV);
        if(sectionSV) {
            sectionSV.textContent = `${evt.data.stateVariable} : ${evt.data.value}`;
        }
    });

    sectionDevices.appendChild( section );
}




const sio = io(/*{
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: Infinity
}*/);

sio.on("connect", () => {
    console.log("Connection with socket.io server established");
});

sio.on("disconnect", () => {
    console.log("socket.io disconnect");
});

sio.on("property", descr => {
    console.log("property", descr);
});

sio.on("Hello", data => {
    console.log("Hello data", data);
});

sio.on("UPNP::devices", devices => {
    console.log("UPNP::devices", devices);
    devices.map( D => createDevice(D) ).forEach( ({device: D, section: node}) => {
        const label = document.createElement("label");
        label.classList.add("tab");
        label.textContent = `${D.friendlyName || D.USN}`;
        sectionTabs.appendChild(label);
        label.onclick = () => {
            Array.from( document.querySelectorAll("label.tab") ).forEach( l => l.classList.remove("selected") );
            label.classList.add("selected");
            Array.from( document.querySelectorAll("section.device") ).forEach( s => s.classList.add("hidden") );
            node.classList.remove("hidden");
        };
        node.classList.add("hidden");
        sectionDevices.appendChild(node);
    } );
});

sio.connect();


function createDevice(D) {
    const section = document.createElement("section");
    section.classList.add("device");
    section.innerHTML = `<section class="attributes">
        <p>${D.friendlyName} : ${D.USN}</p>
        <p>${D.baseURL}</p>
        </section>
        <section class="services"></section>
    `;
    const sectionServices = section.querySelector("section.services");
    D.services.map(S => createService(S, D.USN)).forEach( S => sectionServices.appendChild(S) );
    return {device: D, section};
}

function createService(S, deviceId) {
    const section = document.createElement("section");
    section.classList.add("service");
    section.innerHTML = `<section class="attributes">
        <p>${S.serviceType} : ${S.serviceId}</p>
        <p>controlURL: ${S.controlURL}</p>
        <table><tbody></tbody></table>
        </section>
        <ul class="actions"></ul>
    `;
    const tbody = section.querySelector("tbody");
    let str = "";
    for(let propName in S.properties) {
        str += `<tr><td>${propName}</td><td>${S.properties[propName]}</td></tr>`;
    }
    tbody.innerHTML = str;

    const sectionActions = section.querySelector("ul.actions");
    S.actions.map(A => createAction(A, S.serviceId, deviceId)).forEach( A => {
        const li = document.createElement("li");
        li.appendChild(A);
        sectionActions.appendChild(li)
    } );
    return section;
}

function createAction(A, serviceId, deviceId) {
    const section = document.createElement("section");
    section.classList.add("action");
    section.innerHTML = `<section class="attributes">
        <p>${A.name} : ${A.serviceType}</p>
        <section class="parameters in"></section>
        ------------- <button>CALL</button>-------------
        <section class="parameters out"></section>
    `;

    const sectionParametersIn = section.querySelector("section.parameters.in");
    A.args.filter( a => a.direction === "in").forEach( a => {
        sectionParametersIn.appendChild( createArgument(a) );
    });
    const sectionParametersOut = section.querySelector("section.parameters.out");
    A.args.filter( a => a.direction === "out").forEach( a => {
        sectionParametersOut.appendChild( createArgument(a) );
    });

    section.querySelector("button").onclick = () => {
        const args = Array.from( sectionParametersIn.querySelectorAll("input") ).reduce(
            (obj, input) => {
                obj[input.getAttribute("name")] = input.value;
                return obj;
            },
            {}
        );
        const call = {serviceId, deviceId, actionName: A.name, args};
        console.log("call", call);
        sio.emit("call", call, res => {
            console.log("response", res);
        });
    };


    return section;
}

function createArgument(A) {
    const label = document.createElement("label");
    label.innerHTML = `${A.name} <input name="${A.name}"/>`;

    return label;
}
