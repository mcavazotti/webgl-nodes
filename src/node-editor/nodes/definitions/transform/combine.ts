import { NodeCategory, ParameterType, SocketType } from "../../types/enums";
import { NodeConfiguration } from "../../types/interfaces";

export const combineNode: NodeConfiguration = {
    label: 'Combine Components',
    category: NodeCategory.transform,
    type: 'combine',
    inputSokets: [
        {
            label: 'x',
            type: SocketType.float,
            role: "input",
            state: {
                uid: '',
                connection: null,
                hide: false,
                value: 0
            }
        },
        {
            label: 'y',
            type: SocketType.float,
            role: "input",
            state: {
                uid: '',
                connection: null,
                hide: false,
                value: 0
            }
        },
        {
            label: 'z',
            type: SocketType.float,
            role: "input",
            state: {
                uid: '',
                connection: null,
                hide: true,
                value: 0
            }
        },
        {
            label: 'w',
            type: SocketType.float,
            role: "input",
            state: {
                uid: '',
                connection: null,
                hide: true,
                value: 0
            }
        }
    ],
    outputSockets: [
        {
            label: 'Vector',
            type: SocketType.vector2,
            role: "output",
            state: {
                uid: '',
                connection: null,
                hide: false,
            }
        },
        {
            label: 'Vector',
            type: SocketType.vector3,
            role: "output",
            state: {
                uid: '',
                connection: null,
                hide: true,
            }
        },
        {
            label: 'Vector',
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
                ['2D Vector', '2d'],
                ['3D Vector', '3d'],
                ['4D Vector', '4d']
            ],
            state: {
                uid: '',
                value: '2d',
                hide: false
            },
            callback: (v: '2d' | '3d' | '4d', n) => {
                switch (v) {
                    case "2d":
                        n.inputSokets.forEach((s, i) => s.state!.hide = i >= 2);
                        n.outputSockets.forEach((s, i) => s.state!.hide = i != 0);
                        break;
                    case "3d":
                        n.inputSokets.forEach((s, i) => s.state!.hide = i >= 3);
                        n.outputSockets.forEach((s, i) => s.state!.hide = i != 1);
                        break;
                    case "4d":
                        n.inputSokets.forEach((s, i) => s.state!.hide = i >= 4);
                        n.outputSockets.forEach((s, i) => s.state!.hide = i != 2);
                        break;
                }
                return true;
            }
        }
    ],
    code: (n) => {
        switch(n.parameters[0].state!.value) {
            case "2d":
                return "vec2 #o0 = vec2(#i0, #i1);\n";
            case "3d":
                return "vec3 #o1 = vec3(#i0, #i1, #i2);\n";
            case "4d":
                return "vec4 #o2 = vec4(#i0, #i1, #i2, #i3);\n";
        }
        return '';

    },
    definitions: (_) => []

}