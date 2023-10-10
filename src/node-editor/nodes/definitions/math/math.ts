import { Vector2, Vector3, Vector4 } from "../../../core/math/vector";
import { NodeCategory, ParameterType, SocketType } from "../../types/enums";
import { NodeConfiguration } from "../../types/interfaces";

enum InputSocketIdx {
    boolA,
    floatA,
    vec2A,
    vec3A,
    vec4A,
    boolB,
    floatB,
    vec2B,
    vec3B,
    vec4B,
};
enum OutputSocketIdx {
    boolC,
    floatC,
    vec2C,
    vec3C,
    vec4C,
};
enum ParameterIdx {
    type,
    bool,
    float,
    vec2,
    vec3,
    vec4,
    clamp,
};

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
            callback: (v, pv, n) => {
                if (v == pv) return false;
                switch (v as string) {
                    case 'bool':
                        n.inputSokets.forEach((s, i) => s.state!.hide = ![InputSocketIdx.boolA, InputSocketIdx.boolB].includes(i));
                        n.outputSockets.forEach((s, i) => s.state!.hide = i != OutputSocketIdx.boolC);
                        n.parameters.forEach((p, i) => p.state!.hide = ![ParameterIdx.type, ParameterIdx.bool].includes(i));
                        return true;
                    case 'float':
                        n.inputSokets.forEach((s, i) => s.state!.hide = ![InputSocketIdx.floatA, InputSocketIdx.floatB].includes(i));
                        n.outputSockets.forEach((s, i) => s.state!.hide = i != OutputSocketIdx.floatC);
                        n.parameters.forEach((p, i) => p.state!.hide = ![ParameterIdx.type, ParameterIdx.float, ParameterIdx.clamp].includes(i));
                        return true;
                    case '2d':
                        n.inputSokets.forEach((s, i) => s.state!.hide = ![InputSocketIdx.vec2A, InputSocketIdx.vec2B].includes(i));
                        n.outputSockets.forEach((s, i) => s.state!.hide = i != OutputSocketIdx.vec2C);
                        n.parameters.forEach((p, i) => p.state!.hide = ![ParameterIdx.type, ParameterIdx.vec2, ParameterIdx.clamp].includes(i));
                        return true;
                    case '3d':
                        n.inputSokets.forEach((s, i) => s.state!.hide = ![InputSocketIdx.vec3A, InputSocketIdx.vec3B].includes(i));
                        n.outputSockets.forEach((s, i) => s.state!.hide = i != OutputSocketIdx.vec3C);
                        n.parameters.forEach((p, i) => p.state!.hide = ![ParameterIdx.type, ParameterIdx.vec3, ParameterIdx.clamp].includes(i));
                        return true;
                    case '4d':
                        n.inputSokets.forEach((s, i) => s.state!.hide = ![InputSocketIdx.vec4A, InputSocketIdx.vec4B].includes(i));
                        n.outputSockets.forEach((s, i) => s.state!.hide = i != OutputSocketIdx.vec4C);
                        n.parameters.forEach((p, i) => p.state!.hide = ![ParameterIdx.type, ParameterIdx.vec4, ParameterIdx.clamp].includes(i));
                        return true;
                }
                return false;
            }
        },
        {
            label: 'Op',
            type: ParameterType.select,
            params: [
                ['And', 'and'],
                ['Or', 'or'],
                ['Not', 'not'],
                ['Xor', 'xor'],
            ],
            state: {
                uid: '',
                value: 'and',
                hide: true,
            },
            callback: (v: 'and' | 'or' | 'not' | 'xor', pv: 'and' | 'or' | 'not' | 'xor', n) => {
                if (v == pv || (v != 'not' && pv != 'not')) return false;

                n.inputSokets[InputSocketIdx.boolB].state!.hide = v == 'not';
                return true;
            }
        },
        {
            label: 'Op',
            type: ParameterType.select,
            params: [
                ['Functions', [
                    ['Add', 'add'],
                    ['Subtract', 'sub'],
                    ['Multiply', 'mul'],
                    ['Divide', 'div'],
                    ['Power', 'pow'],
                    ['Logarithm', 'log'],
                    ['Square Root', 'sqrt'],
                    ['Absolute', 'abs'],
                    ['Exponent', 'exp'],
                ]],
                ['Comparison', [
                    ['Minimum', 'min'],
                    ['Maximum', 'max'],
                    ['Less Than', 'lt'],
                    ['Grerater Than', 'gt'],
                    ['Sign', 'sign'],
                ]],
                ['Rounding', [
                    ['Round', 'round'],
                    ['Floor', 'floor'],
                    ['Ceil', 'ceil'],
                    ['Truncate', 'trunc'],
                    ['Fraction', 'frac'],
                    ['Modulo', 'mod'],
                    ['Snap', 'snap'],
                ]],
                ['Trigonometric', [
                    ['Sine', 'sin'],
                    ['Cosine', 'cos'],
                    ['Tangent', 'tan'],
                    ['Arcsine', 'asin'],
                    ['Arccosine', 'acos'],
                    ['Arctangent', 'atan'],
                    ['Arctan2', 'atan2'],
                    ['Hyp. Sine', 'sinh'],
                    ['Hyp. Cosine', 'cosh'],
                    ['Hyp. Tangent', 'tanh'],
                ]],
                ['Conversion', [
                    ['To Radians', 'rad'],
                    ['To Degrees', 'deg'],
                ]]
            ],
            state: {
                uid: '',
                value: 'add',
                hide: false,
            },
            callback: (v: string, pv: string, n) => {
                const unaryOp = [
                    'sqrt', 'abs', 'log', 'exp',
                    'sign',
                    'round', 'floor', 'ceil', 'trunc', 'frac',
                    'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh',
                    'rad', 'deg'
                ];

                if (v == pv) return false;
                if (unaryOp.includes(v) == unaryOp.includes(pv)) return false;

                n.inputSokets[InputSocketIdx.floatB].state!.hide = unaryOp.includes(v);
                return true;
            }
        },
        {
            label: 'Op',
            type: ParameterType.select,
            params: [
                ['Functions', [
                    ['Add', 'add'],
                    ['Subtract', 'sub'],
                    ['Multiply', 'mul'],
                    ['Divide', 'div'],
                    ['Project', 'proj'],
                    ['Reflect', 'refl'],
                    ['Dot Product', 'dot'],
                    ['Distance', 'dist'],
                    ['Length', 'len'],
                    ['Scale', 'smul'],
                    ['Normalize', 'norm'],
                    ['Absolute', 'abs'],
                ]],
                ['Comparison', [
                    ['Minimum', 'min'],
                    ['Maximum', 'max'],
                ]],
                ['Rounding', [
                    ['Snap', 'snap'],
                    ['Floor', 'floor'],
                    ['Ceil', 'ceil'],
                    ['Modulo', 'mod'],
                    ['Fraction', 'frac'],
                ]],
                ['Trigonometric', [
                    ['Sine', 'sin'],
                    ['Cosine', 'cos'],
                    ['Tangent', 'tan'],
                ]],
            ],
            state: {
                uid: '',
                value: 'add',
                hide: true,
            },
            callback: (v: string, pv: string, n) => {
                const unaryOp = ['len', 'norm', 'floor', 'ceil', 'frac', 'abs', 'sin', 'cos', 'tan'];
                const scalarResult = ['dot', 'dist', 'len'];
                const scalarArgument = ['smul', 'snap', 'mod'];

                if (v == pv) return false;
                if (unaryOp.includes(v) == unaryOp.includes(pv)
                    && scalarResult.includes(v) == scalarResult.includes(pv)
                    && scalarArgument.includes(v) == scalarArgument.includes(pv))
                    return false;

                n.inputSokets[InputSocketIdx.vec2B].state!.hide = unaryOp.includes(v) || scalarArgument.includes(v);
                n.inputSokets[InputSocketIdx.floatB].state!.hide = !scalarArgument.includes(v);
                n.outputSockets[OutputSocketIdx.floatC].state!.hide = !scalarResult.includes(v);
                n.outputSockets[OutputSocketIdx.vec2C].state!.hide = scalarResult.includes(v);
                return true;
            }
        },
        {
            label: 'Op',
            type: ParameterType.select,
            params: [
                ['Functions', [
                    ['Add', 'add'],
                    ['Subtract', 'sub'],
                    ['Multiply', 'mul'],
                    ['Divide', 'div'],
                    ['Project', 'proj'],
                    ['Reflect', 'refl'],
                    ['Dot Product', 'dot'],
                    ['Cross Product', 'cross'],
                    ['Distance', 'dist'],
                    ['Length', 'len'],
                    ['Scale', 'smul'],
                    ['Normalize', 'norm'],
                    ['Absolute', 'abs'],
                ]],
                ['Comparison', [
                    ['Minimum', 'min'],
                    ['Maximum', 'max'],
                ]],
                ['Rounding', [
                    ['Snap', 'snap'],
                    ['Floor', 'floor'],
                    ['Ceil', 'ceil'],
                    ['Modulo', 'mod'],
                    ['Fraction', 'frac'],
                ]],
                ['Trigonometric', [
                    ['Sine', 'sin'],
                    ['Cosine', 'cos'],
                    ['Tangent', 'tan'],
                ]],
            ],
            state: {
                uid: '',
                value: 'add',
                hide: true,
            },
            callback: (v: string, pv: string, n) => {
                const unaryOp = ['len', 'norm', 'floor', 'ceil', 'frac', 'abs', 'sin', 'cos', 'tan'];
                const scalarResult = ['dot', 'dist', 'len'];
                const scalarArgument = ['smul', 'snap', 'mod'];

                if (v == pv) return false;
                if (unaryOp.includes(v) == unaryOp.includes(pv)
                    && scalarResult.includes(v) == scalarResult.includes(pv)
                    && scalarArgument.includes(v) == scalarArgument.includes(pv))
                    return false;

                n.inputSokets[InputSocketIdx.vec3B].state!.hide = unaryOp.includes(v) || scalarArgument.includes(v);
                n.inputSokets[InputSocketIdx.floatB].state!.hide = !scalarArgument.includes(v);
                n.outputSockets[OutputSocketIdx.floatC].state!.hide = !scalarResult.includes(v);
                n.outputSockets[OutputSocketIdx.vec3C].state!.hide = scalarResult.includes(v);
                return true;
            }
        },
        {
            label: 'Op',
            type: ParameterType.select,
            params: [
                ['Functions', [
                    ['Add', 'add'],
                    ['Subtract', 'sub'],
                    ['Multiply', 'mul'],
                    ['Divide', 'div'],
                    ['Project', 'proj'],
                    ['Reflect', 'refl'],
                    ['Dot Product', 'dot'],
                    ['Distance', 'dist'],
                    ['Length', 'len'],
                    ['Scale', 'smul'],
                    ['Normalize', 'norm'],
                    ['Absolute', 'abs'],
                ]],
                ['Comparison', [
                    ['Minimum', 'min'],
                    ['Maximum', 'max'],
                ]],
                ['Rounding', [
                    ['Snap', 'snap'],
                    ['Floor', 'floor'],
                    ['Ceil', 'ceil'],
                    ['Modulo', 'mod'],
                    ['Fraction', 'frac'],
                ]],
                ['Trigonometric', [
                    ['Sine', 'sin'],
                    ['Cosine', 'cos'],
                    ['Tangent', 'tan'],
                ]],
            ],
            state: {
                uid: '',
                value: 'add',
                hide: true,
            },
            callback: (v: string, pv: string, n) => {
                const unaryOp = ['len', 'norm', 'floor', 'ceil', 'frac', 'abs', 'sin', 'cos', 'tan'];
                const scalarResult = ['dot', 'dist', 'len'];
                const scalarArgument = ['smul', 'snap', 'mod'];

                if (v == pv) return false;
                if (unaryOp.includes(v) == unaryOp.includes(pv)
                    && scalarResult.includes(v) == scalarResult.includes(pv)
                    && scalarArgument.includes(v) == scalarArgument.includes(pv))
                    return false;

                n.inputSokets[InputSocketIdx.vec4B].state!.hide = unaryOp.includes(v) || scalarArgument.includes(v);
                n.inputSokets[InputSocketIdx.floatB].state!.hide = !scalarArgument.includes(v);
                n.outputSockets[OutputSocketIdx.floatC].state!.hide = !scalarResult.includes(v);
                n.outputSockets[OutputSocketIdx.vec4C].state!.hide = scalarResult.includes(v);
                return true;
            }
        },
        {
            label: 'Clamp',
            type: ParameterType.check,
            state: {
                uid: '',
                hide: false,
                value: false,
            },
        }
    ],
    code: (n) => {
        if (n.parameters[ParameterIdx.type].state!.value == 'bool') {
            let op: string;
            switch (n.parameters[ParameterIdx.bool].state!.value) {
                case 'and':
                    op = '&&';
                    break;
                case 'or':
                    op = '||';
                    break;
                case 'xor':
                    op = '^^';
                    break
            }
            if (n.parameters[ParameterIdx.bool].state!.value != 'not')
                return `bool #o${OutputSocketIdx.boolC} = #i${InputSocketIdx.boolA} ${op!} #i${InputSocketIdx.boolB};\n`;
            return `bool #o${OutputSocketIdx.boolC} = !#i${InputSocketIdx.boolA};\n`;
        }
        else {
            const unaryFunc = new Map([
                ['log', 'log'],
                ['sqrt', 'sqrt'],
                ['abs', 'abs'],
                ['exp', 'exp'],
                ['sign', 'sign'],
                ['round', 'round'],
                ['floor', 'floor'],
                ['ceil', 'ceil'],
                ['trunc', 'trunc'],
                ['frac', 'fract'],
                ['sin', 'sin'],
                ['cos', 'cos'],
                ['tan', 'tan'],
                ['asin', 'asin'],
                ['acos', 'acos'],
                ['atan', 'atan'],
                ['sinh', 'sinh'],
                ['cosh', 'cosh'],
                ['tanh', 'tanh'],
                ['rad', 'radians'],
                ['deg', 'degrees'],
                ['len', 'length'],
                ['norm', 'normalize']
            ]);
            const binFunc = new Map([
                ['pow', 'pow'],
                ['min', 'min'],
                ['max', 'max'],
                ['mod', 'mod'],
                ['atan2', 'atan'],
                ['snap', 'snap'],
                ['proj', 'project'],
                ['refl', 'reflect'],
                ['dot', 'dot'],
                ['dist', 'distance'],
                ['cross', 'cross']
            ]);
            const op = new Map([
                ['add', '+'],
                ['sub', '-'],
                ['mul', '*'],
                ['smul', '*'],
                ['div', '/'],
                ['lt', '<'],
                ['gt', '>'],
            ]);

            let paramIdx: number;
            let operandAIdx: number;
            let operandBIdx: number;
            let resultIdx: number;
            let resultType: string;
            switch (n.parameters[ParameterIdx.type].state!.value) {
                case 'float':
                    paramIdx = ParameterIdx.float;
                    operandAIdx = InputSocketIdx.floatA;
                    resultType = 'float';
                    break;
                case '2d':
                    paramIdx = ParameterIdx.vec2;
                    operandAIdx = InputSocketIdx.vec2A;
                    resultType = 'vec2';
                    break;
                case '3d':
                    paramIdx = ParameterIdx.vec3;
                    operandAIdx = InputSocketIdx.vec3A;
                    resultType = 'vec3';
                    break;
                case '4d':
                    paramIdx = ParameterIdx.vec4;
                    operandAIdx = InputSocketIdx.vec4A;
                    resultType = 'vec4';
                    break;
            }

            const paramVal = n.parameters[paramIdx!].state!.value as string;
            if (n.parameters[ParameterIdx.type].state!.value == 'float' || ['smul', 'snap', 'mod'].includes(paramVal)) {
                operandBIdx = InputSocketIdx.floatB;
            } else {
                switch (n.parameters[ParameterIdx.type].state!.value) {
                    case '2d':
                        operandBIdx = InputSocketIdx.vec2B;
                        break;
                    case '3d':
                        operandBIdx = InputSocketIdx.vec3B;
                        break;
                    case '4d':
                        operandBIdx = InputSocketIdx.vec4B;
                        break;
                }
            }
            if (n.parameters[ParameterIdx.type].state!.value == 'float' || ['dot', 'dist', 'len'].includes(paramVal)) {
                resultIdx = OutputSocketIdx.floatC;
                resultType = 'float';
            } else {
                switch (n.parameters[ParameterIdx.type].state!.value) {
                    case '2d':
                        resultIdx = OutputSocketIdx.vec2C;
                        break;
                    case '3d':
                        resultIdx = OutputSocketIdx.vec3C;
                        break;
                    case '4d':
                        resultIdx = OutputSocketIdx.vec4C;
                        break;
                }
            }
            let expression: string;
            if ([...binFunc.keys()].includes(paramVal))
                expression = `${binFunc.get(paramVal)}(#i${operandAIdx!}, #i${operandBIdx!})`;
            else if ([...unaryFunc.keys()].includes(paramVal))
                expression = `${unaryFunc.get(paramVal)}(#i${operandAIdx!})`;
            else if (paramVal == 'lt' || paramVal == 'gt')
                expression = `(#i${operandAIdx!} ${op.get(paramVal)} #i${operandBIdx!})? 1.0: 0.0`;
            else
                expression = `#i${operandAIdx!} ${op.get(paramVal)} #i${operandBIdx!}`;
            if (n.parameters[ParameterIdx.clamp].state!.value)
                expression = `clamp(${expression}, 0.0, 1.0)`;
            return `${resultType!} #o${resultIdx!} = ${expression};\n`;

        }
    },
    definitions: (n) => {

        switch (n.parameters[ParameterIdx.type].state!.value) {
            case 'float':
                if (n.parameters[ParameterIdx.float].state!.value == 'snap') {
                    return [[
                        'snapf',
                        `
                            float snap(float a, float b) {
                                return round(a/b)*b;
                            } 
                        `
                    ]];
                }
                return [];
            case '2d':
                if (n.parameters[ParameterIdx.vec2].state!.value == 'snap') {
                    return [[
                        'snapv2',
                        `
                            vec2 snap(vec2 a, float b) {
                                return round(a/b)*b;
                            } 
                        `
                    ]];
                }
                if (n.parameters[ParameterIdx.vec2].state!.value == 'snap') {
                    return [[
                        'projectv2',
                        `
                            vec2 project(vec2 a, vec2 b) {
                                vec2 normB = normalize(b);
                                return normB * dot(a, normB);
                            }
                        `
                    ]];
                }
                return [];
            case '3d':
                if (n.parameters[ParameterIdx.vec3].state!.value == 'snap') {
                    return [[
                        'snapv3',
                        `
                            vec3 snap(vec3 a, float b) {
                                return round(a/b)*b;
                            } 
                        `
                    ]];
                }
                if (n.parameters[ParameterIdx.vec3].state!.value == 'snap') {
                    return [[
                        'projectv3',
                        `
                            vec3 project(vec3 a, vec3 b) {
                                vec3 normB = normalize(b);
                                return normB * dot(a, normB);
                            }
                        `
                    ]];
                }
                return [];
            case '4d':
                if (n.parameters[ParameterIdx.vec4].state!.value == 'snap') {
                    return [[
                        'snapv4',
                        `
                            vec4 snap(vec4 a, float b) {
                                return round(a/b)*b;
                            } 
                        `
                    ]];
                }
                if (n.parameters[ParameterIdx.vec4].state!.value == 'snap') {
                    return [[
                        'projectv4',
                        `
                            vec4 project(vec4 a, vec4 b) {
                                vec4 normB = normalize(b);
                                return normB * dot(a, normB);
                            }
                        `
                    ]];
                }
                return [];
        }
        return []
    }

}