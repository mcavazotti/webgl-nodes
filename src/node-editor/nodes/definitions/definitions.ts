import { NodeConfiguration } from "../types/interfaces";
import { coordinatesNode } from "./input/coordinates";
import { combineNode } from "./transform/combine";
import { separateNode } from "./transform/separate";


export const AVAILABLE_NODES: {[name: string]: NodeConfiguration} = {
    coordinates: coordinatesNode,
    separate: separateNode,
    combine: combineNode
}