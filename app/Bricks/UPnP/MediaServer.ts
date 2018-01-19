import {BrickUPnP} from "./BrickUPnP";
import {CALL_RESULT, Device, Service} from "alx-upnp";
import * as xmldom from "xmldom";

const xmldomparser = new xmldom.DOMParser();

export function instantiateMediaServer(device: Device): boolean {
    if (device.getType().indexOf("schemas-upnp-org:device:MediaServer") >= 0) {
        // Instantiate MediaServer
        // console.log("MediaServer");
        new MediaServer(device);
        return true;
    } else {
        return false;
    }
}

export class MediaServer extends BrickUPnP {
    private serviceContentDirectory: Service;

    constructor(device: Device) {
        super(device);
        this.types.push("MediaServer");
        this.serviceContentDirectory = device.findServiceFromType( "urn:schemas-upnp-org:service:ContentDirectory");
    }

    Browse(itemId: string, flag: BrowseFlag): Promise<BrowseResult> {
        if (flag !== BrowseFlag.BrowseDirectChildren && flag !== BrowseFlag.BrowseMetadata) {
            throw {
                message: "Unknown BrowseFlag",
                flag,
                tip: `Should be ${BrowseFlag.BrowseDirectChildren} or ${BrowseFlag.BrowseMetadata}`
            };
        }
        return this.callContentDirectory("Browse", {
            ObjectID		: itemId,
            BrowseFlag		: flag, // "BrowseDirectChildren",
            Filter			: "*",
            StartingIndex	: 0,
            RequestedCount	: 0,
            SortCriteria	: ""
        }).then(
            res => {
                const {/*doc,*/ containers, items} = this.extractContainersAndItems( res.out["Result"] );
                console.log("Browse", itemId, flag);
                console.log(BrowseFlag.BrowseMetadata, BrowseFlag.BrowseDirectChildren);
                switch (flag) {
                    case BrowseFlag.BrowseMetadata:
                        return containers[0] || items[0];
                    case BrowseFlag.BrowseDirectChildren:
                        return {containers, items};
                }
        },
            err => {throw {message: err}; }
        );
    }

    private callContentDirectory(actionName: string, args: Object): Promise<CALL_RESULT> {
        return this.serviceContentDirectory.call( {actionName, args} );
    }

    private extractContainersAndItems(didl: string): {doc: Document, containers: UPnP_container[], items: UPnP_item[]} {
        const doc = xmldomparser.parseFromString(didl);
        const containers = getNodes(doc.documentElement, ["container"]).map( C => ({
            id: C.getAttribute("id"),
            parentID: C.getAttribute("parentID"),
            restricted: C.getAttribute("restricted") === "1",
            searchable: C.getAttribute("searchable") === "1",
            title: getNodeContent(C, ["title", "dc:title"]),
            creator: getNodeContent(C, ["creator", "dc:creator"]),
            date: getNodeContent(C, ["date", "dc:date"]),
            publisher: getNodeContent(C, ["publisher", "dc:publisher"]),
            description: getNodeContent(C, ["description", "dc:description"]),
            genre: getNodesContent(C, ["genre", "upnp:genre"]),
            episodeSeason: getNodeContent(C, ["episodeSeason", "upnp:episodeSeason"]),
            class: getNodeContent(C, ["class", "upnp:class"]),
            albumArtURI: getNodeContent(C, ["albumArtURI", "upnp:albumArtURI"]),
            longDescription: getNodeContent(C, ["longDescription", "upnp:longDescription"]),
            icon: getNodeContent(C, ["icon", "upnp:icon"]),
            seriesTitle: getNodeContent(C, ["seriesTitle", "upnp:seriesTitle"])
        }) );
        const items = getNodes(doc.documentElement, ["item"]).map( I => ({
            id: I.getAttribute("id"),
            parentID: I.getAttribute("parentID"),
            restricted: I.getAttribute("restricted") === "1",
            title: getNodeContent(I, ["title", "dc:title"]),
            creator: getNodeContent(I, ["creator", "dc:creator"]),
            date: getNodeContent(I, ["date", "dc:date"]),
            publisher: getNodeContent(I, ["publisher", "dc:publisher"]),
            description: getNodeContent(I, ["description", "dc:description"]),
            genre: getNodesContent(I, ["genre", "upnp:genre"]),
            episodeSeason: getNodeContent(I, ["episodeSeason", "upnp:episodeSeason"]),
            class: getNodeContent(I, ["class", "upnp:class"]),
            albumArtURI: getNodeContent(I, ["albumArtURI", "upnp:albumArtURI"]),
            longDescription: getNodeContent(I, ["longDescription", "upnp:longDescription"]),
            icon: getNodeContent(I, ["icon", "upnp:icon"]),
            seriesTitle: getNodeContent(I, ["seriesTitle", "upnp:seriesTitle"]),
            raw: didl,
            res: getNodes(I, ["res"]).map( R => ({
                uri: R.textContent,
                duration: R.getAttribute("duration"),
                size: parseInt( R.getAttribute("size") ),
                resolution: R.getAttribute("resolution"),
                bitrate: parseInt( R.getAttribute("bitrate") ),
                nrAudioChannels: parseInt( R.getAttribute("nrAudioChannels") ),
                protocolInfo: R.getAttribute("protocolInfo")
            }) )[0]
        }) );

        return {doc, containers, items};
    }
}

function getNodeContent(root: Element, names: string[], defaultValue: string = ""): string {
    const node = getNode(root, names);
    return node ? node.textContent : defaultValue;
}

function getNodesContent(root: Element, names: string[], defaultValue: string = ""): string[] {
    return [];
}

function getNode(root: Element, names: string[]): Element {
    for (let name of names) {
        const node = root.getElementsByTagName(name)[0];
        if (node) {
            return node;
        }
    }
    return null;
}

function getNodes(root: Element, names: string[]): Element[] {
    for (let name of names) {
        const nodes = root.getElementsByTagName(name);
        if (nodes.length > 0) {
            return Array.from( nodes );
        }
    }
    return [];
}

export enum BrowseFlag {
    BrowseMetadata      = "BrowseMetadata",
    BrowseDirectChildren= "BrowseDirectChildren"
}

export type BrowseMetaDataResult = UPnP_container | UPnP_item;
export type BrowsDirectChildrenResult = {containers: UPnP_container[], items: UPnP_item[]};
export type BrowseResult = BrowseMetaDataResult | BrowsDirectChildrenResult;

export type UPnP_container = {
    id: string;
    parentID: string;
    restricted: boolean;
    searchable: boolean;
    title: string;
    creator: string;
    date: string;
    publisher: string;
    genre: string[];
    episodeSeason: string;
    class: string;
    albumArtURI: string;
    description: string;
    longDescription: string;
    icon: string;
    seriesTitle: string;
};

export type UPnP_item = {
    id: string;
    parentID: string;
    restricted: boolean;
    title?: string;
    creator?: string;
    date?: string;
    publisher?: string;
    genre?: string[];
    episodeSeason?: string;
    class: string;
    albumArtURI?: string;
    description: string;
    longDescription: string;
    icon?: string;
    seriesTitle?: string;
    raw: string;
    res: {
        uri: string;
        duration: string;
        size: number;
        resolution: string;
        bitrate: number;
        nrAudioChannels: number;
        protocolInfo: string;
    };
};

/*
<item id="9efe71ba056bf503e063" parentID="9a2209c319eb8e655a37" restricted="1">
	<dc:title>2006 Baudisch Uist06 Phosphor</dc:title>
	<dc:creator>Unknown</dc:creator>
	<upnp:genre>Unknown</upnp:genre>
	<upnp:albumArtURI dlna:profileID="JPEG_MED">http://192.168.56.1:32469/proxy/8d37cb5abcf6cf52f81b/albumart.jpg</upnp:albumArtURI>
	<dc:description>2006 Baudisch Uist06 Phosphor</dc:description>
	<upnp:icon>http://192.168.56.1:32469/proxy/6dca43a532887af98c8b/icon.jpg</upnp:icon>
	<res duration="0:00:57.000" size="1263622" resolution="640x480" bitrate="21875" nrAudioChannels="2" protocolInfo="http-get:*:video/x-msvideo:DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01500000000000000000000000000000">http://192.168.56.1:32469/object/9efe71ba056bf503e063/file.avi</res>
	<upnp:class>object.item.videoItem.movie</upnp:class>
</item>

<container id="8db62204870fc3d7945b" parentID="032a2b2a04bdc6c5c384" restricted="1" searchable="0">
    <dc:title>By Content Rating</dc:title>
    <dc:creator>Unknown</dc:creator>
    <upnp:genre>Unknown</upnp:genre>
    <dc:description>By Content Rating</dc:description>
    <dc:date>2016-01-14</dc:date>
    <dc:publisher>Unknown</dc:publisher>

    <upnp:albumArtURI dlna:profileID="JPEG_MED">http://192.168.56.1:32469/proxy/fe233613e9ac3300ad3e/albumart.jpg</upnp:albumArtURI>
    <upnp:episodeSeason>0</upnp:episodeSeason>
    <upnp:class>object.container.storageFolder</upnp:class>
    <upnp:longDescription>Set in the near future, Los Angeles has been walled-off and isolated by a mysterious occupying force. “Colony” centers on a family torn by opposing forces, struggling to balance difficult decisions to stay together while trying to survive in the new world order.
    <upnp:genre>Drama</upnp:genre>
    <upnp:icon>http://192.168.56.1:32469/proxy/68a1158e1b6b96974989/icon.jpg</upnp:icon>
    <upnp:seriesTitle>Colony</upnp:seriesTitle>
    <upnp:class>object.container.playlistContainer</upnp:class>

</container>
 */
