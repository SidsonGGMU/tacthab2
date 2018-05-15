import {connect} from "./mongo";
import {HumanReadableProgram} from "ccbl-js/ProgramObjectInterface";
import {Brick} from "../Bricks/Brick";

export function loadPrograms(userId: string): HumanReadableProgram[] {
    return [];
}


class BrickDataBase extends Brick {
    connect() {
        connect();
    }

    //
}

export const brickDataBase = new BrickDataBase({name: "dataBase", id: "dataBase"});

