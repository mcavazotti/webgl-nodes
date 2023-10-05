import { Vector2 } from "../../core/math/vector";
import { NodeCategory, ParameterType, SocketType } from "./enums";

export interface SocketData {
    uid: string;
    connection: [string, SocketType] | null;
    value?: unknown;
    hide: boolean;
}

export interface Socket {
    label: string;
    type: SocketType;
    state?: SocketData;
    role: "input" | "output";
}

export interface ParameterData {
    uid: string;
    value?: unknown;
    hide: boolean;
}

export interface Parameter {
    type: ParameterType;
    params: unknown;
    label: string;
    state?: ParameterData;
    callback?(val: unknown, node: NodeConfiguration): boolean;
}

export interface NodeData {
    uid: string;
    positition?: Vector2;
}

export interface NodeConfiguration {
    inputSokets: Socket[];
    outputSockets: Socket[];
    parameters: Parameter[];
    label: string;
    category: NodeCategory;
    type: string;
    state?: NodeData;
    definitions: (node: NodeConfiguration) => [string, string][];
    code: (node: NodeConfiguration) => string;
}