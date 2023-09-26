import { Vector2 } from "../core/math/vector";
import { Camera } from "../core/render/camera";
import { cubicBelzier } from "../core/render/canvas-primitives";
import { AVAILABLE_NODES } from "../nodes/definitions/definitions";
import { outputNode } from "../nodes/definitions/output/output";
import { Node } from "../nodes/node";
import { NodeEngine } from "../nodes/node-engine";
import { DragAction, SelectAction, getDragAction } from "./input-handler";

export class NodeEditor {
    private boardDiv: HTMLDivElement;
    private boardCanvas: HTMLCanvasElement;
    private boardCanvasCtx: CanvasRenderingContext2D;

    private camera: Camera;

    private nodeEngine: NodeEngine = new NodeEngine();

    private inputState: {
        drag: DragAction | null;
        select: SelectAction | null;
    } = { drag: null, select: null };

    constructor(boardId: string, outputId: string) {
        this.boardDiv = document.querySelector(`#${boardId} div`) as HTMLDivElement;
        this.boardCanvas = document.querySelector(`#${boardId} canvas`) as HTMLCanvasElement;

        if (!this.boardDiv || !this.boardCanvas) {
            throw Error("Could not locate board elements");
        }
        this.boardCanvasCtx = this.boardCanvas.getContext('2d')!;

        this.resizeCanvas();

        this.setInputHandlers();

        this.camera = new Camera(new Vector2(), 1, new Vector2(this.boardDiv.clientWidth, this.boardDiv.clientHeight));

        this.nodeEngine.addNode(new Node(outputNode));
        this.addNodesToBoard();
    }

    private addNodesToBoard() {
        this.boardDiv.replaceChildren();
        for (const node of this.nodeEngine.getNodes()) {
            node.destroy();
            const template = document.createElement('template');
            template.innerHTML = node.getHtml();
            this.boardDiv.appendChild(template.content);
            node.setHTMLElement();
            node.setListeners();
            this.setNodePosition(node);
        }
        this.drawConnections();
    }

    private setNodePosition(node: Node) {
        const screenPos = this.camera.convertWorldToRaster(node.config.state!.positition!);
        const nodeElem = node.getOuterElement()!;
        nodeElem.style.left = screenPos.x + 'px';
        nodeElem.style.top = screenPos.y + 'px';
    }

    private drawConnections() {
        this.boardCanvasCtx.strokeStyle = 'white';
        this.boardCanvasCtx.lineWidth = 2;
        const connections = this.nodeEngine.getConnections();
        this.boardCanvasCtx.beginPath();

        for (const connection of connections) {
            const socket1 = document.getElementById(`socket-${connection[0]}`)!;
            const socket2 = document.getElementById(`socket-${connection[1]}`)!;

            const centerPoint1 = this.getSocketElementCenter(socket1);
            const centerPoint2 = this.getSocketElementCenter(socket2);

            this.setConnectionPath(centerPoint1, centerPoint2);
        }

        this.boardCanvasCtx.stroke();
    }

    private getSocketElementCenter(socketElement: HTMLElement): Vector2 {
        const borderTotalIncrement = 4;
        const centerPoint = new Vector2(socketElement.getBoundingClientRect().left + ((socketElement.getBoundingClientRect().width - borderTotalIncrement) / 2),
            socketElement.getBoundingClientRect().top + ((socketElement.getBoundingClientRect().height - borderTotalIncrement) / 2));
        const correctedCenter = centerPoint.sub(new Vector2(this.boardCanvas.getBoundingClientRect().left, this.boardCanvas.getBoundingClientRect().top));

        return correctedCenter;

    }

    private setConnectionPath(p1: Vector2, p2: Vector2) {
        if ((p1.sub(p2)).length < 200) {
            this.boardCanvasCtx.moveTo(p1.x, p1.y);
            this.boardCanvasCtx.lineTo(p2.x, p2.y);
        } else {
            cubicBelzier(this.boardCanvasCtx, [
                p1,
                p1.add(new Vector2(100, 0)),
                p2.add(new Vector2(-100, 0)),
                p2
            ]);
        }
    }

    private setInputHandlers() {
        this.boardDiv.addEventListener('mousedown', (ev) => {
            if (ev.button == 0) {
                this.inputState.drag = getDragAction(ev, this.camera, this.boardCanvas);
                if (this.inputState.select && this.inputState.select.id != this.inputState.drag?.id)
                    this.nodeEngine.getNodeById(this.inputState.select.id)!.setSelection(false);


                if (this.inputState.drag?.element == 'node') {
                    this.inputState.select = {
                        element: 'node',
                        id: this.inputState.drag.id!
                    };
                    this.nodeEngine.getNodeById(this.inputState.select.id)!.setSelection(true);
                } else {
                    if (this.inputState.select) {
                        this.nodeEngine.getNodeById(this.inputState.select.id)!.setSelection(false);
                    }
                    this.inputState.select = null;
                }

            }

        });

        this.boardDiv.addEventListener('mouseup', (ev) => {
            if (this.inputState.drag?.element == 'socket' && (ev.target as HTMLElement)?.id.includes('socket-')) {
                try {
                    this.nodeEngine.createConnection(this.inputState.drag.id!, (ev.target as HTMLElement).dataset.socketId!);
                } catch (error) {
                    throw error;
                } finally {
                    if (this.inputState.drag) this.inputState.drag = null;
                }

                this.boardCanvasCtx.clearRect(0, 0, this.boardCanvas.width, this.boardCanvas.height);
                this.drawConnections();

            }

            if (this.inputState.drag) this.inputState.drag = null;
        });

        this.boardDiv.addEventListener('mousemove', (ev) => {
            this.boardCanvasCtx.clearRect(0, 0, this.boardCanvas.width, this.boardCanvas.height);
            this.drawConnections();

            if (this.inputState.drag) {
                switch (this.inputState.drag.element) {
                    case 'node':
                        {
                            const htmlNode = this.inputState.drag.htmlElement!;
                            const newPos = new Vector2((this.inputState.drag.elementPos!.x + ev.clientX - this.inputState.drag.initialMousePos.x), (this.inputState.drag.elementPos!.y + ev.clientY - this.inputState.drag.initialMousePos.y));
                            htmlNode.style.top = newPos.y + 'px';
                            htmlNode.style.left = newPos.x + 'px';

                            const node = this.nodeEngine.getNodeById(this.inputState.drag.id!)!;
                            node.config.state!.positition = this.camera.convertRasterToWorld(newPos);
                            break;
                        }
                    case 'board':
                        {
                            const mouseWorldPos = this.camera.convertRasterToWorld(new Vector2(ev.clientX, ev.clientY));
                            this.camera.position = this.camera.position.sub(mouseWorldPos.sub(this.inputState.drag.initialMousePosWorld));

                            for (const n of this.nodeEngine.getNodes()) {
                                this.setNodePosition(n);
                            }
                            break;
                        }
                    case 'socket':
                        {


                            const socket = this.nodeEngine.getSocketById(this.inputState.drag.id!)!;



                            const mousePos = new Vector2(ev.clientX - this.boardCanvas.getBoundingClientRect().left, ev.clientY - this.boardCanvas.getBoundingClientRect().top);

                            if (socket.role == 'input') {
                                if (socket.state!.connection) {
                                    const outputSocketId = socket.state!.connection[0];
                                    const outputSocket = document.getElementById(`socket-${socket.state!.connection[0]}`)!;
                                    this.inputState.drag.id = outputSocketId;
                                    this.inputState.drag.htmlElement = outputSocket;

                                    this.nodeEngine.deleteConnection(socket.state!.uid);
                                    this.boardCanvasCtx.beginPath();
                                    this.setConnectionPath(mousePos, this.getSocketElementCenter(outputSocket));
                                    this.boardCanvasCtx.stroke();
                                } else {
                                    this.boardCanvasCtx.beginPath();
                                    this.setConnectionPath(mousePos, this.getSocketElementCenter(this.inputState.drag.htmlElement!));
                                    this.boardCanvasCtx.stroke();
                                }
                            } else {
                                this.boardCanvasCtx.beginPath();
                                this.setConnectionPath(this.getSocketElementCenter(this.inputState.drag.htmlElement!), mousePos);
                                this.boardCanvasCtx.stroke();
                            }


                            break;
                        }
                }
            }
        });

        this.boardDiv.addEventListener('wheel', (ev) => {
            if (ev.deltaY > 0) {
                this.camera.zoom = Math.min(this.camera.zoom + 1, 10);
            }
            if (ev.deltaY < 0) {
                this.camera.zoom = Math.max(this.camera.zoom - 1, 1);
            }

            for (const n of this.nodeEngine.getNodes()) {
                n.getOuterElement()!.style.transform = `scale(${1 / this.camera.zoom})`;
                n.getOuterElement()!.style.transformOrigin = `top left`;
                this.setNodePosition(n);
            }

            this.boardCanvasCtx.clearRect(0, 0, this.boardCanvas.width, this.boardCanvas.height);
            this.drawConnections();

        });

        this.boardDiv.addEventListener('keydown', (ev) => {
            console.log(ev.code)
            switch (ev.code) {
                case 'KeyX':
                case 'Delete':
                    if (this.inputState.select) {
                        const node = this.nodeEngine.getNodeById(this.inputState.select.id)!;
                        if (this.nodeEngine.removeNode(node))
                            this.inputState.select = null;
                    }
                    break;
            }
        });
    }

    resizeCanvas() {
        this.boardCanvas.width = this.boardCanvas.clientWidth;
        this.boardCanvas.height = this.boardCanvas.clientHeight;
    }

    addNode(nodeName: string) {
        const nodeConfig = AVAILABLE_NODES[nodeName];
        this.nodeEngine.addNode(new Node(nodeConfig));
        this.addNodesToBoard();
    }
}