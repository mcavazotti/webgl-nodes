import { Vector2, Vector3, Vector4 } from "../../../core/math/vector";
import { NodeCategory, ParameterType, SocketType } from "../../types/enums";
import { NodeConfiguration } from "../../types/interfaces";

export const mathNode: NodeConfiguration = {
    label: 'Math',
    category: NodeCategory.mathOp,
    type: 'math',
    inputSokets: [
        {
            label: 'a',
            role: 'input',
            type: SocketType.bool,
            state: {
                uid: '',
                connection: null,
                hide: true,
                value: true
            }
        },
        {
            label: 'b',
            role: 'input',
            type: SocketType.bool,
            state: {
                uid: '',
                connection: null,
                hide: true,
                value: true
            }
        },
        {
            label: 'a',
            role: 'input',
            type: SocketType.float,
            state: {
                uid: '',
                connection: null,
                hide: false,
                value: 0
            }
        },
        {
            label: 'b',
            role: 'input',
            type: SocketType.float,
            state: {
                uid: '',
                connection: null,
                hide: false,
                value: 0
            }
        },
        {
            label: 'a',
            role: 'input',
            type: SocketType.vector2,
            state: {
                uid: '',
                connection: null,
                hide: true,
                value: new Vector2()
            }
        },
        {
            label: 'b',
            role: 'input',
            type: SocketType.vector2,
            state: {
                uid: '',
                connection: null,
                hide: true,
                value: new Vector2()
            }
        },
        {
            label: 'a',
            role: 'input',
            type: SocketType.vector3,
            state: {
                uid: '',
                connection: null,
                hide: true,
                value: new Vector3()
            }
        },
        {
            label: 'b',
            role: 'input',
            type: SocketType.vector3,
            state: {
                uid: '',
                connection: null,
                hide: true,
                value: new Vector3()
            }
        },
        {
            label: 'a',
            role: 'input',
            type: SocketType.vector4,
            state: {
                uid: '',
                connection: null,
                hide: true,
                value: new Vector4()
            }
        },
        {
            label: 'b',
            role: 'input',
            type: SocketType.vector4,
            state: {
                uid: '',
                connection: null,
                hide: true,
                value: new Vector4()
            }
        },
    ],
    outputSockets: [
        {
            label: 'c',
            role: 'output',
            type: SocketType.bool,
            state: {
                connection: null,
                uid: '',
                hide: true
            }
        },
        {
            label: 'c',
            role: 'output',
            type: SocketType.float,
            state: {
                connection: null,
                uid: '',
                hide: false
            }
        },
        {
            label: 'c',
            role: 'output',
            type: SocketType.vector2,
            state: {
                connection: null,
                uid: '',
                hide: true
            }
        },
        {
            label: 'c',
            role: 'output',
            type: SocketType.vector3,
            state: {
                connection: null,
                uid: '',
                hide: true
            }
        },
        {
            label: 'c',
            role: 'output',
            type: SocketType.vector4,
            state: {
                connection: null,
                uid: '',
                hide: true
            }
        },
    ],
    parameters: [
        {
            label: 'Type',
            type: ParameterType.select,
            state: {
                uid: '',
                value: 'float',
                hide: false,
            },
            params: [
                ['Boolean', 'bool'],
                ['Number', 'float'],
                ['2D Vector', '2d'],
                ['3D Vector', '3d'],
                ['4D Vector', '4d']
            ],
            callback: (v, n) => {
                switch (v as string) {
                    case 'bool':
                        n.inputSokets.forEach((s, i) => s.state!.hide = ![0, 1].includes(i));
                        n.outputSockets.forEach((s, i) => s.state!.hide = i != 0);
                        return true;
                    case 'float':
                        n.inputSokets.forEach((s, i) => s.state!.hide = ![2, 3].includes(i));
                        n.outputSockets.forEach((s, i) => s.state!.hide = i != 1);
                        return true;
                    case '2d':
                        n.inputSokets.forEach((s, i) => s.state!.hide = ![4, 5].includes(i));
                        n.outputSockets.forEach((s, i) => s.state!.hide = i != 2);
                        return true;
                    case '3d':
                        n.inputSokets.forEach((s, i) => s.state!.hide = ![6, 7].includes(i));
                        n.outputSockets.forEach((s, i) => s.state!.hide = i != 3);
                        return true;
                    case '4d':
                        n.inputSokets.forEach((s, i) => s.state!.hide = ![8, 9].includes(i));
                        n.outputSockets.forEach((s, i) => s.state!.hide = i != 4);
                        return true;
                }
                return false;
            }
        }
    ],
    code: (n) => '',
    definitions: (n) => []

}