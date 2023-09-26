import { NodeConfiguration } from "../types/interfaces";
import { coordinatesNode } from "./input/coordinates";


export const AVAILABLE_NODES: {[name: string]: NodeConfiguration} = {
    coordinates: coordinatesNode
}