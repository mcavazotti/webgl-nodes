import { Node } from "../node";
import { NodeConfiguration } from "../types/interfaces";
import { convertSocketTypes, declareSocketValue, getNodeIdFromSocketId, getVariableNameForId } from "./code-gen-helpers";

export interface CompileDataProviderFunc {
    (): { nodes: Map<string, Node>, root: Node, uniforms: string[] };
}

export interface CompilationDoneFunc {
    (code: string | null, error: string | null): void;
}

interface CompilationData {
    definitions: Map<string, string>;
    visitedNode: Set<string>;
    visiting: Set<string>;
    mainCode: string;
}

export class NodeCompiler {
    private static instance: NodeCompiler;

    public beautifyCode = false;

    static getInstance() {
        if (!this.instance) this.instance = new NodeCompiler();
        return this.instance;
    }

    private processCompileRequest?: CompileDataProviderFunc;
    private compilationDone?: CompilationDoneFunc;

    private constructor() {
    }

    setCompileRequestListener(func: CompileDataProviderFunc) {
        this.processCompileRequest = func;
    }

    setCompilationDoneListener(func: CompilationDoneFunc) {
        this.compilationDone = func;
    }

    compile() {
        if (!this.processCompileRequest) return;
        let fragShaderCode: string | null = null;
        let error: string | null = null;
        try {
            const compileData = this.processCompileRequest();
            fragShaderCode = this.compileShader(compileData.nodes, compileData.root, compileData.uniforms);
        } catch(e: any) {
            console.log(e)
            error = e as string;
        }finally {
            if (this.compilationDone) this.compilationDone(fragShaderCode, error);
        }

    }

    compileShader(nodes: Map<string, Node>, root: Node, uniforms: string[]): string {
        let data: CompilationData = {
            definitions: new Map(),
            visitedNode: new Set(),
            visiting: new Set(),
            mainCode: ""
        };
        this.transverseNodes(root, nodes, data);
        let finalCode = "precision mediump float;\n";

        for (const uniform of uniforms) {
            finalCode += uniform;
            finalCode += "\n";
        }

        for (const definition of data.definitions.values()) {
            finalCode += definition;
            finalCode += "\n";
        }

        finalCode += "void main() {\n" +
            `${data.mainCode}` +
            "}";

        if (this.beautifyCode) {
            let bracketCounter = 0;
            finalCode = finalCode.split('\n').map(line => {
                const trimmedLine = line.trim();
                if (trimmedLine.includes('}')) bracketCounter--;
                const identedLine = '\t'.repeat(bracketCounter) + trimmedLine + '\n';
                if (trimmedLine.includes('{')) bracketCounter++;
                return identedLine;
            }).join('');
        }
        // console.log(finalCode)
        return finalCode;
    }

    transverseNodes(node: Node, nodes: Map<string, Node>, compilationData: CompilationData) {
        // console.log(node.label)
        if (compilationData.visitedNode.has(node.config.state!.uid))
            return;

        if (compilationData.visiting.has(node.config.state!.uid))
            throw Error("Cycle detected");

        compilationData.visiting.add(node.config.state!.uid);

        for (const input of node.config.inputSokets) {
            if (input.state!.connection)
                this.transverseNodes(nodes.get(getNodeIdFromSocketId(input.state!.connection[0]))!, nodes, compilationData);
        }

        for (const definition of node.config.definitions(node.config)) {
            if (!compilationData.definitions.has(definition[0])) {
                compilationData.definitions.set(definition[0], definition[1]);
            }
        }

        compilationData.visiting.delete(node.config.state!.uid);
        compilationData.visitedNode.add(node.config.state!.uid);
        compilationData.mainCode += this.processCode(node.config);
    }

    private processCode(config: NodeConfiguration): string {
        let code = config.code(config);
        const placeholderPattern = /#([io])([0-9]+)/g;

        for (const match of code.matchAll(placeholderPattern)) {
            const socketRole = match[1];
            const socketIdx = Number.parseInt(match[2]);

            if (socketRole == 'o') {
                code = code.replace(match[0], getVariableNameForId(config.outputSockets[socketIdx].state!.uid));
            } else {
                const socket = config.inputSokets[socketIdx];
                if (socket.state!.connection) {
                    code = code.replace(match[0], convertSocketTypes(socket.state!.connection[1], socket.type, getVariableNameForId(socket.state!.connection[0])));
                } else {
                    code = code.replace(match[0], declareSocketValue(socket));
                }
            }
        }
        return code
    }

}