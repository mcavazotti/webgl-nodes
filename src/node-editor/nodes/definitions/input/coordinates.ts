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
            label: 'Aspect Ratio',
            role: 'output',
            type: SocketType.float,
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
        float #o2 = uResolution.x / uResolution.y;
        `,
    definitions: (_) => []
}