import * as fs from "fs-extra";
import * as path from "path";

const mapConfig = new Map<string, any>();

export function saveConfig(key: string, value: any) {
    mapConfig.set(key, value);
    saveToFile();
}

export function loadConfig(key: string): any {
    return mapConfig.get(key);
}

const configPath = path.join(__dirname, "../../configurations")
async function saveToFile(fName: string = "./config.json"): Promise<any> {
    const config = {};
    const pathConfig = path.join(configPath, fName);
    mapConfig.forEach( (val, key) => config[key] = val );
    return fs.writeJson(pathConfig, config);
}

async function loadFromFile(fName: string = "./config.json") {
    const pathConfig = path.join(configPath, fName);
    const config = await fs.readJson(pathConfig);
    for (let key in config) {
        mapConfig.set(key, config[key]);
    }
}

loadFromFile();
