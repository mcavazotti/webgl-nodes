export enum SocketType {
    bool = "bool",
    float = "float",
    vector2 = "vector2",
    vector3 = "vector3",
    vector4 = "vector4",
    color = "color",
}

export enum ParameterType {
    select = "select",
    check = "check",
}

export enum NodeCategory {
    input = "input",
    transform = "transform",
    mathOp = "mathOp",
    output = "output"
}

export const mapNodeCategory = new Map<NodeCategory,string>([
    [NodeCategory.input, "Input"],
    [NodeCategory.transform, "Transform"],
    [NodeCategory.mathOp, "Math"],
    [NodeCategory.output, "Output"],
])
