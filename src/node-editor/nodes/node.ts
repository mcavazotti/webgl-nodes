import { ColorRGBA } from "../core/math/color";
import { Vector } from "../core/math/vector";
import { Vector2, Vector3, Vector4 } from "../core/math/vector";
import { HTMLComponent } from "../core/render/html-component";
import { Selectable } from "../core/render/selectable";
import { NodeCompiler } from "./compiler/node-compiler";
import { SocketType } from "./types/enums";
import { NodeConfiguration, Socket } from "./types/interfaces";

export class Node extends HTMLComponent implements Selectable {
    private static _idCounter: number = 0;
    private static get idNum() {
        const id = Node._idCounter;
        Node._idCounter++;
        return id;
    }

    static setCounter(num: number) {
        this._idCounter = num;
    }

    selected: boolean = false;
    readonly config: NodeConfiguration;

    constructor(config: NodeConfiguration) {
        super();
        this.config = { ...config };
        this.config.inputSokets = config.inputSokets.map(s => this.setSocketConfig(s));
        this.config.outputSockets = config.outputSockets.map(s => this.setSocketConfig(s));
        if (!this.config.state) {
            this.config.state = {
                uid: `n-${Node.idNum.toString().padStart(4, '0')}`,
                positition: new Vector2(),
            };
        }
        else {
            this.config.state = { ...config.state! };
            this.config.state!.positition = config.state!.positition?.copy();
            this.config.state!.uid = `n-${Node.idNum.toString().padStart(4, '0')}`;
        }

        this.config.inputSokets.forEach((s, i) => {
            if (!s.state) throw Error('no default state for socket');
            s.state.uid = `i-${this.config.state!.uid}-${i}`;
        });

        this.config.outputSockets.forEach((s, i) => {
            if (!s.state) throw Error('no default state for socket');
            s.state.uid = `o-${this.config.state!.uid}-${i}`;
        });
    }
    private setSocketConfig(s: Socket): Socket {
        const newSocket = JSON.parse(JSON.stringify(s)) as Socket;
        if (newSocket.state?.value && 'copy' in (s.state?.value as Vector))
            newSocket.state!.value = (s.state?.value as Vector).copy()
        return newSocket;
    }

    setSelection(selectState: boolean): void {
        this.selected = selectState;
        if (selectState)
            this.getOuterElement()!.classList.add('selected', 'top');
        else
            this.getOuterElement()!.classList.remove('selected', 'top');
    }

    htmlElementGetter(): HTMLElement {
        return document.getElementById(`node-${this.config.state!.uid}`)!;
    }

    getHtml(): string {
        return `
        <div id="node-${this.config.state!.uid}" class="node" data-node-id="${this.config.state!.uid}">
            <div class="header ${this.config.category}">
                <span>${this.config.label}</span>
            </div>
            <div class="body">
                <div id="output-sockets-${this.config.state!.uid}">
                    ${this.getSocketHtml('output')}
                </div>
                <div id="input-sockets-${this.config.state!.uid}">
                    ${this.getSocketHtml('input')}
                </div>
            </div>
        </div>`;
    }

    private getSocketHtml(type: 'input' | 'output'): string {
        const sockets = type == 'input' ? this.config.inputSokets : this.config.outputSockets;
        return sockets.filter(socket => !socket.state!.hide).map((socket) =>
            `
                    <div class="socket-row ${type}">
                        <span>${socket.label}</span>
                        <div class="socket ${socket.type}" id="socket-${socket.state!.uid}" data-socket-id="${socket.state!.uid}"></div>
                    </div>
                    ${socket.state!.connection || type == 'output' ? '' : `<div class="socket-row">${this.generateInput(socket)}</div>`}
            `
        ).reduce((a, b) => a + '\n' + b, '');
    }

    private generateInput(socket: Socket): string {
        switch (socket.type) {
            case SocketType.bool: {
                return `<input type="checkbox" id="input-${socket.state!.uid}" ${socket.state!.value ? 'checked' : ''} />`;
            }
            case SocketType.float: {
                return `
                <div class="socket-numeric-input">
                    <input type="number" id="input-${socket.state!.uid}" value="${socket.state!.value}" />
                </div>`;
            }
            case SocketType.vector2: {
                return `
                <div class="socket-numeric-input">
                    <input type="number" id="input-${socket.state!.uid}-x" value="${(socket.state!.value as Vector2)?.x}" />
                    <input type="number" id="input-${socket.state!.uid}-y" value="${(socket.state!.value as Vector2)?.y}" />
                </div>`;
            }
            case SocketType.vector3: {
                return `
                <div class="socket-numeric-input">
                    <input type="number" id="input-${socket.state!.uid}-x" value="${(socket.state!.value as Vector3)?.x}" />
                    <input type="number" id="input-${socket.state!.uid}-y" value="${(socket.state!.value as Vector3)?.y}" />
                    <input type="number" id="input-${socket.state!.uid}-z" value="${(socket.state!.value as Vector3)?.z}" />
                </div>`;
            }
            case SocketType.vector4: {
                return `
                <div class="socket-numeric-input">
                    <input type="number" id="input-${socket.state!.uid}-x" value="${(socket.state!.value as Vector4)?.x}" />
                    <input type="number" id="input-${socket.state!.uid}-y" value="${(socket.state!.value as Vector4)?.y}" />
                    <input type="number" id="input-${socket.state!.uid}-z" value="${(socket.state!.value as Vector4)?.z}" />
                    <input type="number" id="input-${socket.state!.uid}-w" value="${(socket.state!.value as Vector4)?.w}" />
                </div>`;
            }
            case SocketType.color: {
                return `<input type="color" id="input-${socket.state!.uid}" value="${(socket.state!.value as ColorRGBA)?.toHex()}" />`;
            }
            default:
                throw Error('unknown socket type');
        }
    }

    setListeners(): void {
        this.setSocketListeners();
    }

    private setSocketListeners() {
        const nodeCompiler = NodeCompiler.getInstance();

        for (const socket of this.config.inputSokets) {
            switch (socket.type) {
                case SocketType.bool: {
                    const input = document.getElementById(`input-${socket.state!.uid}`) as HTMLInputElement;
                    if (input) {
                        input.addEventListener('click', () => {
                            socket.state!.value = input.checked;
                            nodeCompiler.compile();
                        });
                    }
                    break;
                }
                case SocketType.float: {
                    const input = document.getElementById(`input-${socket.state!.uid}`) as HTMLInputElement;
                    if (input) {
                        input.addEventListener('change', () => {
                            socket.state!.value = input.valueAsNumber;
                            nodeCompiler.compile();
                        });
                    }
                    break;
                }
                case SocketType.vector2: {
                    const x = document.getElementById(`input-${socket.state!.uid}-x`) as HTMLInputElement;
                    const y = document.getElementById(`input-${socket.state!.uid}-y`) as HTMLInputElement;
                    if (x && y) {
                        x.addEventListener('change', () => {
                            if (!socket.state!.value) socket.state!.value = new Vector2(x.valueAsNumber);
                            (socket.state!.value as Vector2).x = x.valueAsNumber;
                            nodeCompiler.compile();
                        });
                        y.addEventListener('change', () => {
                            if (!socket.state!.value) socket.state!.value = new Vector2(0, y.valueAsNumber);
                            (socket.state!.value as Vector2).y = y.valueAsNumber;
                            nodeCompiler.compile();
                        });
                    }
                    break;
                }
                case SocketType.vector3: {
                    const x = document.getElementById(`input-${socket.state!.uid}-x`) as HTMLInputElement;
                    const y = document.getElementById(`input-${socket.state!.uid}-y`) as HTMLInputElement;
                    const z = document.getElementById(`input-${socket.state!.uid}-z`) as HTMLInputElement;
                    if (x && y && z) {
                        x.addEventListener('change', () => {
                            if (!socket.state!.value) socket.state!.value = new Vector3(x.valueAsNumber);
                            (socket.state!.value as Vector3).x = x.valueAsNumber;
                            nodeCompiler.compile();
                        });
                        y.addEventListener('change', () => {
                            if (!socket.state!.value) socket.state!.value = new Vector3(0, y.valueAsNumber);
                            (socket.state!.value as Vector3).y = y.valueAsNumber;
                            nodeCompiler.compile();
                        });
                        z.addEventListener('change', () => {
                            if (!socket.state!.value) socket.state!.value = new Vector3(0, 0, z.valueAsNumber);
                            (socket.state!.value as Vector3).z = z.valueAsNumber;
                            nodeCompiler.compile();
                        });
                    }
                    break;
                }
                case SocketType.vector4: {
                    const x = document.getElementById(`input-${socket.state!.uid}-x`) as HTMLInputElement;
                    const y = document.getElementById(`input-${socket.state!.uid}-y`) as HTMLInputElement;
                    const z = document.getElementById(`input-${socket.state!.uid}-z`) as HTMLInputElement;
                    const w = document.getElementById(`input-${socket.state!.uid}-w`) as HTMLInputElement;
                    if (x && y && z && w) {
                        x.addEventListener('change', () => {
                            if (!socket.state!.value) socket.state!.value = new Vector4(x.valueAsNumber);
                            (socket.state!.value as Vector4).x = x.valueAsNumber;
                            nodeCompiler.compile();
                        });
                        y.addEventListener('change', () => {
                            if (!socket.state!.value) socket.state!.value = new Vector4(0, y.valueAsNumber);
                            (socket.state!.value as Vector4).y = y.valueAsNumber;
                            nodeCompiler.compile();
                        });
                        z.addEventListener('change', () => {
                            if (!socket.state!.value) socket.state!.value = new Vector4(0, 0, z.valueAsNumber);
                            (socket.state!.value as Vector4).z = z.valueAsNumber;
                            nodeCompiler.compile();
                        });
                        w.addEventListener('change', () => {
                            if (!socket.state!.value) socket.state!.value = new Vector4(0, 0, 0, w.valueAsNumber);
                            (socket.state!.value as Vector4).w = w.valueAsNumber;
                            nodeCompiler.compile();
                        });
                    }
                    break;
                }
                case SocketType.color: {
                    const input = document.getElementById(`input-${socket.state!.uid}`) as HTMLInputElement;
                    if (input) {
                        input.addEventListener('change', () => {
                            socket.state!.value = new ColorRGBA(input.value);
                            nodeCompiler.compile();
                        });
                    }
                    break;
                }
            }
        }
    }
}