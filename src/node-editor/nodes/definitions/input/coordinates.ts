import { getVariableNameForId } from "../../compiler/code-gen-helpers";
import { NodeCategory, SocketType } from "../../types/enums";
import { NodeConfiguration } from "../../types/interfaces";

export const coordinatesNode: NodeConfiguration = {
    label: 'Coordinates',
    category: NodeCategory.input,
    type: 'coordinates',
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
    code: (s) => `vec2 ${getVariableNameForId(s.outputSockets[0].state!.uid)} = gl_FragCoord.xy / uResolution;\n`,
    definitions: (_) => []
}