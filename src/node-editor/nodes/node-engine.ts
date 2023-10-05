import { convertSocketTypes } from "./compiler/code-gen-helpers";
import { CompilationDoneFunc, NodeCompiler } from "./compiler/node-compiler";
import { Node } from "./node";
import { Socket } from "./types/interfaces";

export class NodeEngine {
    private nodes: Map<string, Node> = new Map();
    private sockets: Map<string, Socket> = new Map();
    private nodeCompiler: NodeCompiler = NodeCompiler.getInstance();

    constructor(private uniforms: string[], private compileCalback: CompilationDoneFunc, private errorCallback: (error: string)=>void) {
        this.nodeCompiler.setCompileRequestListener(() => {
            return {
                nodes: this.nodes,
                root: this.getRootNode(),
                uniforms: this.uniforms
            }
        });
        this.nodeCompiler.setCompilationDoneListener((code, error) => {
            console.log(code);
            this.compileCalback(code, error);
        });

        this.nodeCompiler.beautifyCode = true;
    }


    getRootNode() {
        return [...this.nodes.values()].find((n) => n.config.type == 'output')!
    }

    getNodeById(id: string) {
        return this.nodes.get(id);
    }

    getSocketById(id: string) {
        return this.sockets.get(id);
    }

    getNodes() {
        return Array.from(this.nodes.values());
    }

    getSocketParent(socket: Socket): Node {
        return this.nodes.get(socket.state!.uid.match(/n-\d{4}/)![0])!
    }

    getConnections(): [string, string][] {
        return Array.from(this.sockets.values()).filter(s => s.role == 'input' && s.state!.connection).map(s => [s.state!.connection![0], s.state!.uid]);
    }

    addNode(n: Node) {
        this.nodes.set(n.config.state!.uid, n);
        n.config.inputSokets.forEach(s => this.sockets.set(s.state!.uid, s));
        n.config.outputSockets.forEach(s => this.sockets.set(s.state!.uid, s));
        this.nodeCompiler.compile();
    }

    removeNode(node: Node): boolean {
        if (node.config.type == 'output') return false;

        node.config.inputSokets.forEach(s => {
            this.deleteConnection(s.state!.uid);
            this.sockets.delete(s.state!.uid);
        });

        node.config.outputSockets.forEach(s => {
            this.deleteConnection(s.state!.uid);
            this.sockets.delete(s.state!.uid);
        });

        node.destroy();
        this.nodes.delete(node.config.state!.uid);
        return true
    }


    createConnection(socket1: string, socket2: string) {
        const sock1 = this.sockets.get(socket1)!;
        const sock2 = this.sockets.get(socket2)!;

        const input = sock1.role == 'input' ? sock1 : sock2;
        const output = sock1.role == 'output' ? sock1 : sock2;

        // test validity of connection
        try {
            convertSocketTypes(output.type, input.type, '');
            input.state!.connection = [output.state!.uid, output.type];

            this.nodeCompiler.transverseNodes(this.getSocketParent(input), this.nodes, {
                definitions: new Map(),
                visitedNode: new Set(),
                visiting: new Set(),
                mainCode: ""
            });
            this.nodeCompiler.compile();
        } catch (error) {
            console.error(error)
            input.state!.connection = null;
            this.errorCallback((error as Error).message);
        }
        // this.getSocketParent(input).updateNode({ inputSockets: true });
    }

    deleteConnection(socketId: string, skipCompile = false) {
        console.log('delete')
        let deleteCount = 0;
        const socket = this.sockets.get(socketId)!;
        if (socket.role == 'input') {
            if (socket.state!.connection)
                deleteCount++;
            socket.state!.connection = null;
            // this.getSocketParent(socket).updateNode({ inputSockets: true });
        } else {
            Array.from(this.sockets.values()).filter(s => s.role == 'input' && s.state!.connection && s.state!.connection[0] == socketId).forEach(s => {
                s.state!.connection = null;
                deleteCount++;
                // this.getSocketParent(s).updateNode({ inputSockets: true });
            });
        }
        if (deleteCount != 0 && !skipCompile)
            this.nodeCompiler.compile();
    }

    refreshConnections() {
        for (const socket of this.sockets.values()) {
            if (socket.state!.hide) {
                this.deleteConnection(socket.state!.uid, true);
            }
        }
        this.nodeCompiler.compile();
    }
}