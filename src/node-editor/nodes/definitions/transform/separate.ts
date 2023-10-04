import { Vector2, Vector3, Vector4 } from "../../../core/math/vector";
import { convertSocketTypes, getVariableNameForId } from "../../compiler/code-gen-helpers";
import { NodeCategory, ParameterType, SocketType } from "../../types/enums";
import { NodeConfiguration, Socket } from "../../types/interfaces";

export const separateNode: NodeConfiguration = {
    label: 'Separate Components',
    category: NodeCategory.transform,
    type: 'separate',
    inputSokets: [
        {
            label: 'Vector',
            type: SocketType.vector2,
            role: "input",
            state: {
                uid: '',
                connection: null,
                hide: false,
                value: new Vector2(),
            }
        },
        {
            label: 'Vector',
            type: SocketType.vector3,
            role: "input",
            state: {
                uid: '',
                connection: null,
                hide: true,
                value: new Vector3(),
            }
        },
        {
            label: 'Vector',
            type: SocketType.vector4,
            role: "input",
            state: {
                uid: '',
                connection: null,
                hide: true,
                value: new Vector4(),
            }
        },
    ],
    outputSockets: [
        {
            label: 'x',
            type: SocketType.float,
            role: "output",
            state: {
                uid: '',
                connection: null,
                hide: false,
            }
        },
        {
            label: 'y',
            type: SocketType.float,
            role: "output",
            state: {
                uid: '',
                connection: null,
                hide: false,
            }
        },
        {
            label: 'z',
            type: SocketType.float,
            role: "output",
            state: {
                uid: '',
                connection: null,
                hide: true,
            }
        },
        {
            label: 'w',
            type: SocketType.float,
            role: "output",
            state: {
                uid: '',
                connection: null,
                hide: true,
            }
        },
    ],
    parameters: [
        {
            type: ParameterType.select,
            label: "Type",
            params: [
                ['2D Vector', '2d'],
                ['3D Vector', '3d'],
                ['4D Vector', '4d']
            ],
            state: {
                uid: '',
                value: '2d'
            },
            callback: (v: '2d' | '3d' | '4d', n) => {
                switch (v) {
                    case "2d":
                        n.inputSokets.forEach((s, i) => s.state!.hide = i != 0);
                        n.outputSockets.forEach((s, i) => s.state!.hide = i >= 2);
                        break;
                    case "3d":
                        n.inputSokets.forEach((s, i) => s.state!.hide = i != 1);
                        n.outputSockets.forEach((s, i) => s.state!.hide = i >= 3);
                        break;
                    case "4d":
                        n.inputSokets.forEach((s, i) => s.state!.hide = i != 2);
                        n.outputSockets.forEach((s, i) => s.state!.hide = i >= 4);
                        break;
                }
                return true;
            }
        }
    ],
    code: (n) => {
        let socket: Socket;
        const vectorType = n.parameters[0].state!.value as string;

        switch (vectorType) {
            case '2d':
            default:
                socket = n.inputSokets[0];
                break;
            case '3d':
                socket = n.inputSokets[1];
                break;
            case '4d':
                socket = n.inputSokets[2];
                break;
        }

        let code: string;
        if (!socket.state!.connection) {
            code = `
                float ${getVariableNameForId(n.outputSockets[0].state!.uid)} = ${(socket.state!.value! as Vector2).x.toFixed(2)};
                float ${getVariableNameForId(n.outputSockets[1].state!.uid)} = ${(socket.state!.value! as Vector2).y.toFixed(2)};\n`;
            if (vectorType == '3d' || vectorType == '4d')
                code += `float ${getVariableNameForId(n.outputSockets[2].state!.uid)} = ${(socket.state!.value! as Vector3).z.toFixed(2)};\n`;
            if (vectorType == '4d')
                code += `float ${getVariableNameForId(n.outputSockets[3].state!.uid)} = ${(socket.state!.value! as Vector4).w.toFixed(2)};\n`;
        }
        else {
            code = `
                float ${getVariableNameForId(n.outputSockets[0].state!.uid)} = ${convertSocketTypes(socket.state!.connection[1], socket.type, getVariableNameForId(socket.state!.connection[0]))}.x;
                float ${getVariableNameForId(n.outputSockets[1].state!.uid)} = ${convertSocketTypes(socket.state!.connection[1], socket.type, getVariableNameForId(socket.state!.connection[0]))}.y;\n`;
            if (vectorType == '3d')
                code += `float ${getVariableNameForId(n.outputSockets[2].state!.uid)} = ${convertSocketTypes(socket.state!.connection[1], socket.type, getVariableNameForId(socket.state!.connection[0]))}.z;\n`;
            if (vectorType == '4d')
                code += `float ${getVariableNameForId(n.outputSockets[3].state!.uid)} = ${convertSocketTypes(socket.state!.connection[1], socket.type, getVariableNameForId(socket.state!.connection[0]))}.w;\n`;
        }
        return code;

    },
    definitions: (_) => []

}