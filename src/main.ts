import { NodeEditor } from './node-editor/editor/editor';
import { AVAILABLE_NODES } from './node-editor/nodes/definitions/definitions';
import { NodeCategory, mapNodeCategory } from './node-editor/nodes/types/enums';
import './style/style.scss';
import sampleTree from './../public/sample-tree.json'


const editor = new NodeEditor('board', 'output');

editor.importNodes(JSON.stringify(sampleTree));

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
        button.classList.add("default-look");
        button.innerHTML = n[1];
        button.onclick = () => {
            editor.addNode(n[0]);
        };
        inDiv.appendChild(button);
    }
    toolBoxDiv.appendChild(outDiv);
});

const saveButton = document.getElementById('save') as HTMLButtonElement;
saveButton.addEventListener('click', () => {
    const filename = prompt('File name:') + '.json';
    const nodeData = editor.exportNodes();
    const file = new Blob([nodeData], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
    a.remove();
});

const loadButton = document.getElementById('load') as HTMLButtonElement;
loadButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', () => {
        if (input.files) {
            const file = input.files[0];
            file.text().then((val) => {
                editor.importNodes(val);
                input.remove();
            })
        }
    })
    input.click();
});

const playButton = document.getElementById('play') as HTMLButtonElement;
const pauseButton = document.getElementById('pause') as HTMLButtonElement;
const resetButton = document.getElementById('reset') as HTMLButtonElement;

playButton.addEventListener('click', ()=> {
    editor.play();
    pauseButton.classList.remove('hidden');
    playButton.classList.add('hidden');
});

pauseButton.addEventListener('click', ()=> {
    editor.pause();
    pauseButton.classList.add('hidden');
    playButton.classList.remove('hidden');
});

resetButton.addEventListener('click', ()=> {
    editor.reset();
});

const copyButton = document.getElementById('copy') as HTMLButtonElement;
copyButton.addEventListener('click', () => {
    const preTag = document.querySelector('pre') as HTMLPreElement;
    navigator.clipboard.writeText(preTag.innerText);
    copyButton.innerText = 'Copied!';
    setTimeout(()=> {
        copyButton.innerText = 'Copy';
    }, 1000);
});

