import { Node } from "../node";
import { getNodeIdFromSocketId } from "./code-gen-helpers";

export interface CompileDataProviderFunc {
    (): { nodes: Map<string, Node>, root: Node, uniforms: string[] };
}

export interface CompilationDoneFunc {
    (code: string): void;
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
        const compileData = this.processCompileRequest();
        const fragShaderCode = this.compileShader(compileData.nodes, compileData.root, compileData.uniforms);

        if (this.compilationDone) this.compilationDone(fragShaderCode);
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
        compilationData.mainCode += node.config.code(node.config);
    }

}