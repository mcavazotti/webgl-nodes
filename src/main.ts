import { NodeEditor } from './node-editor/editor/editor';
import { AVAILABLE_NODES } from './node-editor/nodes/definitions/definitions';
import { NodeCategory, mapNodeCategory } from './node-editor/nodes/types/enums';
import './style/style.scss';


const editor = new NodeEditor('board', 'output');

window.onresize = () => {
    editor.resizeCanvas();
}

const toolBoxDiv = document.getElementById('toolbox') as HTMLDivElement;
const nodeCategories: { [category: string]: [string, string][] } = {};
Object.keys(AVAILABLE_NODES).forEach(k => {
    const node = AVAILABLE_NODES[k];
    const category = node.category;
    if (Object.keys(nodeCategories).includes(category)) {
        nodeCategories[category].push([k, node.label]);
    } else {
        nodeCategories[category] = [[k, node.label]];
    }
});

Object.keys(nodeCategories).forEach(cat => {
    const outDiv = document.createElement('div');
    const inDiv = document.createElement('div')
    outDiv.classList.add('category')
    outDiv.innerHTML = `<h3>${mapNodeCategory.get(cat as NodeCategory)}</h3>`;
    outDiv.appendChild(inDiv);
    for (const n of nodeCategories[cat]) {
        const button = document.createElement('button');
        button.innerHTML = n[1];
        button.onclick = () => {
            editor.addNode(n[0]);
        };
        inDiv.appendChild(button);
    }
    toolBoxDiv.appendChild(outDiv);
});