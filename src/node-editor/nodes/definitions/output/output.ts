import { ColorRGBA } from "../../../core/math/color";
import { SocketType, NodeCategory } from "../../types/enums";
import { NodeConfiguration } from "../../types/interfaces";

export const outputNode: NodeConfiguration = {
    label: 'Output',
    parameters: [],
    inputSokets: [{
        label: 'Color',
        type: SocketType.color,
        role: "input",
        state: {
            uid: '',
            connection: null,
            hide: false,
            value: new ColorRGBA('#000000ff'),
        }
    }],
    outputSockets: [],
    category: NodeCategory.output,
    type: 'output',
    code: (_) => {
        return "color = #i0;\n";

    },
    definitions: (_) => []

}