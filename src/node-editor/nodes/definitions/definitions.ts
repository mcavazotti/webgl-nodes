import { NodeConfiguration } from "../types/interfaces";
import { coordinatesNode } from "./input/coordinates";
import { timeNode } from "./input/time";
import { mathNode } from "./math/math";
import { combineNode } from "./transform/combine";
import { mixNode } from "./transform/mix";
import { separateNode } from "./transform/separate";


export const AVAILABLE_NODES: {[name: string]: NodeConfiguration} = {
    coordinates: coordinatesNode,
    separate: separateNode,
    combine: combineNode,
    math: mathNode,
    mix: mixNode,
    time: timeNode
}