import { NodeCategory, SocketType } from "../../types/enums";
import { NodeConfiguration } from "../../types/interfaces";

export const timeNode: NodeConfiguration = {
    category: NodeCategory.input,
    label: 'Time',
    type: 'time',
    outputSockets: [
        {
            label: 'Elapsed Time',
            role: "output",
            type: SocketType.float,
            state: {
                connection: null,
                hide: false,
                uid: '',
            }
        },
        {
            label: 'Frame Number',
            role: "output",
            type: SocketType.float,
            state: {
                connection: null,
                hide: false,
                uid: '',
            }
        },
    ],
    inputSokets: [],
    parameters: [],
    definitions: (_) => [],
    code: (_) => {
        return `
        float #o0 = uTime;
        float #o1 = uFrame;
        `;
    }
}