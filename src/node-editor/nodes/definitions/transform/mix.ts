import { Vector2, Vector3, Vector4 } from "../../../core/math/vector";
import { NodeCategory, ParameterType, SocketType } from "../../types/enums";
import { NodeConfiguration } from "../../types/interfaces";

enum InputSocketIdx {
    fac,
    floatA,
    vec2A,
    vec3A,
    vec4A,
    floatB,
    vec2B,
    vec3B,
    vec4B,
};
enum OutputSocketIdx {
    float,
    vec2,
    vec3,
    vec4,
};


export const mixNode: NodeConfiguration = {
    label: 'Mix',
    category: NodeCategory.transform,
    type: 'mix',
    inputSokets: [
        {
            label: 'Factor',
            type: SocketType.float,
            role: "input",
            state: {
                uid: '',
                connection: null,
                hide: false,
                value: 0.5
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
            label: 'Result',
            type: SocketType.float,
            role: "output",
            state: {
                uid: '',
                connection: null,
                hide: false,
            }
        },
        {
            label: 'Result',
            type: SocketType.vector2,
            role: "output",
            state: {
                uid: '',
                connection: null,
                hide: true,
            }
        },
        {
            label: 'Result',
            type: SocketType.vector3,
            role: "output",
            state: {
                uid: '',
                connection: null,
                hide: true,
            }
        },
        {
            label: 'Result',
            type: SocketType.vector4,
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
                ['Number', 'num'],
                ['2D Vector', '2d'],
                ['3D Vector', '3d'],
                ['4D Vector', '4d']
            ],
            state: {
                uid: '',
                value: 'num',
                hide: false
            },
            callback: (v: 'num' |'2d' | '3d' | '4d', pv, n) => {
                if (v == pv) return false;
                switch (v) {
                    case "num":
                        n.inputSokets.forEach((s, i) => s.state!.hide = ![InputSocketIdx.fac, InputSocketIdx.floatA, InputSocketIdx.floatB ].includes(i));
                        n.outputSockets.forEach((s, i) => s.state!.hide = i != OutputSocketIdx.float);
                        break;
                    case "2d":
                        n.inputSokets.forEach((s, i) => s.state!.hide = ![InputSocketIdx.fac, InputSocketIdx.vec2A, InputSocketIdx.vec2B ].includes(i));
                        n.outputSockets.forEach((s, i) => s.state!.hide = i != OutputSocketIdx.vec2);
                        break;
                    case "3d":
                        n.inputSokets.forEach((s, i) => s.state!.hide = ![InputSocketIdx.fac, InputSocketIdx.vec3A, InputSocketIdx.vec3B ].includes(i));
                        n.outputSockets.forEach((s, i) => s.state!.hide = i != OutputSocketIdx.vec3);
                        break;
                    case "4d":
                        n.inputSokets.forEach((s, i) => s.state!.hide = ![InputSocketIdx.fac, InputSocketIdx.vec4A, InputSocketIdx.vec4B ].includes(i));
                        n.outputSockets.forEach((s, i) => s.state!.hide = i != OutputSocketIdx.vec4);
                        break;
                }
                return true;
            }
        }
    ],
    code: (n) => {
        let socketA: number;
        let socketB: number;
        let socketResult: number;
        let returnType: string;
        switch (n.parameters[0].state!.value) {
            default:
            case "num":
                socketA = InputSocketIdx.floatA;
                socketB = InputSocketIdx.floatB;
                socketResult = OutputSocketIdx.float;
                returnType = 'float';
                break;
            case "2d":
                socketA = InputSocketIdx.vec2A;
                socketB = InputSocketIdx.vec2B;
                socketResult = OutputSocketIdx.vec2;
                returnType = 'vec2';
                break;
            case "3d":
                socketA = InputSocketIdx.vec3A;
                socketB = InputSocketIdx.vec3B;
                socketResult = OutputSocketIdx.vec3;
                returnType = 'vec3';
                break;
            case "4d":
                socketA = InputSocketIdx.vec4A;
                socketB = InputSocketIdx.vec4B;
                socketResult = OutputSocketIdx.vec4;
                returnType = 'vec4';
                break;
        }
        return `${returnType} #o${socketResult} = mix(#i${socketA}, #i${socketB}, #i0);\n`;

    },
    definitions: (_) => []

}