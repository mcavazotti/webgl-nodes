import { NodeEditor } from './node-editor/editor/editor';
import { AVAILABLE_NODES } from './node-editor/nodes/definitions/definitions';
import './style/style.scss';


const editor = new NodeEditor('board','output');

window.onresize = () => {
    editor.resizeCanvas();
}

const toolBoxDiv = document.getElementById('toolbox') as HTMLDivElement;

Object.keys(AVAILABLE_NODES).forEach(k => {
    const node = AVAILABLE_NODES[k];
    const button = document.createElement('button');
    button.innerHTML = node.label;
    button.onclick = () => {
        editor.addNode(k);
    };
    toolBoxDiv.appendChild(button);
});