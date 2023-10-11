import { NodeCategory, SocketType } from "../../types/enums";
import { NodeConfiguration } from "../../types/interfaces";

export const coordinatesNode: NodeConfiguration = {
    label: 'Coordinates',
    category: NodeCategory.input,
    type: 'coordinates',
    parameters: [],
    inputSokets: [],
    outputSockets: [
        {
            label: 'Fragment coord.',
            role: 'output',
            type: SocketType.vector2,
            state: {
                connection: null,
                hide: false,
                uid: '',
            }
        },
        {
            label: 'UV',
            role: 'output',
            type: SocketType.vector2,
            state: {
                connection: null,
                hide: false,
                uid: '',
            }
        },
        {
            label: 'XY',
            role: 'output',
            type: SocketType.vector2,
            state: {
                connection: null,
                hide: false,
                uid: '',
            }
        },
        {
            label: 'Aspect Ratio',
            role: 'output',
            type: SocketType.float,
            state: {
                connection: null,
                hide: false,
                uid: '',
            }
        },
        {
            label: 'Resolution',
            role: 'output',
            type: SocketType.vector2,
            state: {
                connection: null,
                hide: false,
                uid: '',
            }
        },
    ],
    code: (_) => `
        vec2 #o0 = gl_FragCoord.xy;
        vec2 #o1 = gl_FragCoord.xy / uResolution;
        float #o3 = uResolution.x / uResolution.y;
        vec2 #o2 = #o1 - vec2(0.5,0.5);
        #o2 = vec2(#o2.x * #o3, #o2.y);
        vec2 #o4 = uResolution;
        `,
    definitions: (_) => []
}