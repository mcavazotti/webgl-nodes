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
            label: 'Coord',
            role: 'output',
            type: SocketType.vector2,
            state: {
                connection: null,
                hide: false,
                uid: '',
            }
        }
    ],
    code: (_) => `vec2 #o0 = gl_FragCoord.xy / uResolution;\n`,
    definitions: (_) => []
}