import {BrickUPnP} from "./BrickUPnP";
// BrickUPnP_MediaServer	= require( './BrickUPnP_MediaServer.js' )
import * as xmldom from "xmldom";
import {CALL_RESULT, Device, Service, StateVariable} from "alx-upnp";
import {getBrickFromId} from "../Brick";
import {BrowseFlag, MediaServer, UPnP_item} from "./MediaServer";

const xmldomparser = new xmldom.DOMParser();

export function instantiateMediaRenderer(device: Device): boolean {
    if (device.getType().indexOf("schemas-upnp-org:device:MediaRenderer") >= 0) {
        // Instantiate MediaServer
        // console.log("MediaRenderer");
        new MediaRenderer(device);
        return true;
    } else {
        return false;
    }
}

function processLastChangeChild(service: Service, N: Element) {
    const svn = N.tagName;
    const SV: StateVariable = service.stateVariables.get(N.tagName);

    switch (svn) {
        case "InstanceID":
            const nodes = Array.from( N.childNodes ) as Element[];
            nodes.forEach( n => processLastChangeChild(service, n) );
            break;
        case "SourceProtocolInfo":
        case "SinkProtocolInfo":
        case "CurrentConnectionIDs":
            if (SV) {
                const val = N.textContent;
                SV.updateValue(val);
            } else {
                console.error("No state variable for", N.tagName);
            }
            break;
        default:
            if (SV) {
                const val = N.getAttribute("val");
                SV.updateValue(val);
            } else {
                console.error("No state variable for", N.tagName);
            }
    }
}

function processLastChange(service: Service, value: string) {
    try {
        const doc = xmldomparser.parseFromString(value, "text/xml");
        const L = Array.from(doc.documentElement.childNodes) as HTMLElement[];
        L.forEach( n => processLastChangeChild(service, n) );
    } catch (err) {
        console.error("Error parsing event:\n", err);
    }
}

export class MediaRenderer extends BrickUPnP {
    private serviceAVTransport: Service;
    private serviceRenderingControl: Service;

    constructor(device: Device) {
        super(device);
        this.types.push("MediaRenderer");

        // console.log("MediaRenderer =", device.toJSON() );

        this.serviceAVTransport      = device.findServiceFromType( "urn:schemas-upnp-org:service:AVTransport"    );
        this.serviceRenderingControl = device.findServiceFromType("urn:schemas-upnp-org:service:RenderingControl");


        // Subscribe to events of AVTransport LastChange to update other variables
        this.serviceAVTransport
            .stateVariables.get("LastChange").getObservable().filter(v => v !== "").forEach(
            value => processLastChange(this.serviceAVTransport, value)
        );

        // Subscribe to events of RenderingControl
        this.serviceRenderingControl
            .stateVariables.get("LastChange").getObservable().filter(v => v !== "").forEach(
            value => processLastChange(this.serviceRenderingControl, value)
        );

        // Subscribe to state variables updates
        this.serviceAVTransport.stateVariables.forEach(
            SV => SV.getObservable().forEach(
                value => this.subjectEvents.next( {
                    attribute: "AVTransport",
                    data: {
                        stateVariable: SV.getName(),
                        value: value
                    }
                })
            )
        );
        this.serviceRenderingControl.stateVariables.forEach(
            SV => SV.getObservable().forEach(
                value => this.subjectEvents.next( {
                    attribute: "RenderingControl",
                    data: {
                        stateVariable: SV.getName(),
                        value: value
                    }
                })
            )
        );
    }

    play(): Promise<CALL_RESULT> {
        return this.CallAVTransport("Play", {
            InstanceID		: 0,
            Speed			: 1
        });
    }

    pause(): Promise<CALL_RESULT> {
        return this.CallAVTransport("Pause", {InstanceID: 0} );
    }

    stop(): Promise<CALL_RESULT> {
        return this.CallAVTransport("Stop", {InstanceID: 0} );
    }

    seek(time: number): Promise<CALL_RESULT> {
        return this.CallAVTransport("Seek", {
            InstanceID  : 0,
            Unit        : "REL_TIME",
            Target      : time
        } );
    }

    getVolume(): Promise<number> {
        return this.CallRenderingControl("GetVolume", {
            InstanceID		: 0,
            Channel			: "Master"
        }).then(
            res => parseInt( res.out["CurrentVolume"] ),
            err => err
        );
    }

    setVolume(volume: number): Promise<CALL_RESULT> {
        return this.CallRenderingControl("SetVolume", {
            InstanceID		: 0,
            Channel			: "Master",
            DesiredVolume	: Math.min(100, Math.max(0, volume) )
        });
    }

    async loadMedia(mediaServerId: string, itemId: string): Promise<CALL_RESULT> {
        console.log("loadMedia", mediaServerId, itemId);
        try {
            const MS = getBrickFromId(mediaServerId) as MediaServer;
            const browseMetadataResult = await MS.Browse(itemId, BrowseFlag.BrowseMetadata) as UPnP_item;
            if (browseMetadataResult.res) {
                return this.loadURI( browseMetadataResult.res.uri, browseMetadataResult );
            } else {
                throw {message: `No ressource for media item`, itemId};
            }
        } catch (err) {
            // self.setUPnP_Media();
            throw err;
        }
    }

    async loadURI(uri: string, metadata: UPnP_item): Promise<CALL_RESULT> {
        try {
            return this.CallAVTransport("SetAVTransportURI", {
                InstanceID: 0,
                CurrentURI: uri,
                CurrentURIMetaData: metadata ? metadata.raw : ""
            });
        } catch (err) {
            if (metadata && metadata.raw) {
                return this.CallAVTransport("SetAVTransportURI", {
                    InstanceID: 0,
                    CurrentURI: uri,
                    CurrentURIMetaData: ""
                });
            }
        }
    }

    private CallAVTransport(actionName: string, args: Object): Promise<CALL_RESULT> {
        return this.CallAction(this.serviceAVTransport.serviceId, actionName, args);
    }

    private CallRenderingControl(actionName: string, args: Object): Promise<CALL_RESULT> {
        return this.CallAction(this.serviceRenderingControl.serviceId, actionName, args);
    }

}


/*
BrickUPnP_MediaRenderer.prototype.setUPnP_Media = function(mediaServerId, itemId, itemMetadata) {
    // console.log("BrickUPnP_MediaRenderer::setUPnP_Media");
    this.MediasStates.UPnP_Media = {
        mediaServerId	: mediaServerId,
        itemId			: itemId,
        itemMetadata	: itemMetadata
    };
    for(var att in this.MediasStates.UPnP_Media) {
        this.emit("eventUPnP"
            , { serviceType	: "UPnP_Media"
                , attribut	: att
                , value		: this.MediasStates.UPnP_Media[att]
            }
        ); // "UPnP_Media", this.MediasStates.UPnP_Media);
    }
};

// UPnP events
BrickUPnP_MediaRenderer.prototype.UpdateEvent	= function(eventNode, service) {
    var i, val, content;
    // console.log("\t", this.brickId, service.serviceType, "<" + eventNode.tagName + ">");
    switch(eventNode.tagName) {
        case 'InstanceID'					:
            val = eventNode.getAttribute('val');
            this.currentInstanceID = val;
            if(typeof this.MediasStates[val] === 'undefined') {this.MediasStates[val] = {};}
            for(i=0; i<eventNode.childNodes.length; i++) {
                this.UpdateEvent( eventNode.childNodes.item(i), service );
            }
            break;
        case 'LastChange':
            var doc = xmldomparser.parseFromString(eventNode.textContent, 'text/xml');
            // console.log( "doc.documentElement:", doc.documentElement.childNodes.length);
            for(i=0; i<doc.documentElement.childNodes.length; i++) {
                this.UpdateEvent( doc.documentElement.childNodes.item(i), service );
            }
            break;
        case 'SourceProtocolInfo'		:
        case 'SinkProtocolInfo'		:
        case 'CurrentConnectionIDs'	:
            content = eventNode.textContent;
            if (typeof this.MediasStates[service.serviceType] === 'undefined') {
                this.MediasStates[service.serviceType] = {};
            }
            this.MediasStates[service.serviceType][eventNode.tagName] = content;
            this.emit		( "eventUPnP"
                , { serviceType	: service.serviceType
                    , attribut	: eventNode.tagName
                    , value		: content
                }
            );
            break;
        default:
            if(eventNode.hasAttribute('val')) {
                val = eventNode.getAttribute('val');
                // this.MediasStates[this.currentInstanceID || 0][eventNode.tagName] = val;
                this.MediasStates[service.serviceType] = this.MediasStates[service.serviceType] || {};
                this.MediasStates[service.serviceType][eventNode.tagName] = val;
                // console.log(service.serviceType, eventNode.tagName, val);
                this.MediasStates[service.serviceType][eventNode.tagName] = val;
                this.emit		(eventNode.tagName, {value: val});
                this.emit		( "eventUPnP"
                    , { serviceType	: service.serviceType //this.currentInstanceID
                        , attribut	: eventNode.tagName
                        , value		: val
                    }
                );
                // webServer.emit	( "eventForBrick_" + this.brickId
                // , { serviceType	: service.serviceType //this.currentInstanceID
                // , attribut	: eventNode.tagName
                // , value		: val
                // }
                // );
            } else {console.error('Event that has no val attribute :', eventNode.tagName);
            }
        //console.log('BrickUPnP_MediaRenderer::UpdateEvent('+eventNode.tagName+') has to be implemented : ');
    }
    // console.log("\t</", eventNode.tagName, ">");
    return this;
}

*/