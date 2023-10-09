import { Parameter } from "./types/interfaces";

type SelectOption = [string, string];
function selectOptions(options: (SelectOption | [string, SelectOption[]])[], selected: string): string {
    let html = '';
    for (let opt of options) {
        const label = opt[0];
        if( typeof(opt[1]) != 'string') 
            html += `
                <optgroup label="${label}">
                ${selectOptions(opt[1], selected)}
                </optgroup>
            `;
        else
            html += `<option value="${opt[1]}" ${opt[1] == selected? 'selected':''}>${label}</option>\n`;
    }
    return html;
}

export function selectHTML(p: Parameter): string {


    let html = `
        <span>${p.label}</span>
        <select id="${p.state!.uid}">
        ${selectOptions(p.params as (SelectOption | [string, SelectOption[]])[], p.state!.value as string)}
        </select>`;
    return html
}
