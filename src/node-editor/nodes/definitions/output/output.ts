import { ColorRGBA } from "../../../core/math/color";
import { convertSocketTypes, getVariableNameForId } from "../../compiler/code-gen-helpers";
import { SocketType, NodeCategory } from "../../types/enums";
import { NodeConfiguration } from "../../types/interfaces";

export const outputNode: NodeConfiguration = {
    label: 'Output',
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
    code: (s) => {
        let code = "gl_FragColor = ";
        let socket = s.inputSokets[0] ;
        if (!socket.state!.connection) {
            code += `vec4${(socket.state!.value as ColorRGBA).toString()}`;
        }
        else {
            code += convertSocketTypes(socket.state!.connection[1], socket.type, getVariableNameForId(socket.state!.connection[0]));
        }
        return code + ";\n";

    },
    definitions: (_) => []

}