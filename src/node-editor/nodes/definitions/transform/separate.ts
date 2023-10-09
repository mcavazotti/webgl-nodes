import { Vector2, Vector3, Vector4 } from "../../../core/math/vector";
import { NodeCategory, ParameterType, SocketType } from "../../types/enums";
import { NodeConfiguration } from "../../types/interfaces";

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
                value: '2d',
                hide: false
            },
            callback: (v: '2d' | '3d' | '4d', pv, n) => {
                if (v == pv) return false;
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
        let socket: string;
        const vectorType = n.parameters[0].state!.value as string;

        switch (vectorType) {
            case '2d':
            default:
                socket = '#i0';
                break;
            case '3d':
                socket = '#i1';
                break;
            case '4d':
                socket = '#i2';
                break;
        }

        let code = `float #o0 = ${socket}.x;
                float #o1 = ${socket}.y;\n`;
        if (vectorType == '3d' || vectorType == '4d')
            code += `float #o2 = ${socket}.z;\n`;
        if (vectorType == '4d')
            code += `float #o3 = ${socket}.w;\n`;
        return code;

    },
    definitions: (_) => []

}