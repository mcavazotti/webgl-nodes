import { Vector2 } from "../../core/math/vector";
import { NodeCategory, SocketType } from "./enums";

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

export interface NodeData {
    uid: string;
    positition?: Vector2;
}

export interface NodeConfiguration {
    inputSokets: Socket[];
    outputSockets: Socket[];
    label: string;
    category: NodeCategory;
    type: string;
    state?: NodeData;
    definitions: (state: NodeConfiguration) => [string, string][];
    code: (state: NodeConfiguration) => string;
}