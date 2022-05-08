import { Core } from "cytoscape"
import { Graph } from "../graph"
import { Pin } from "./pin"
import functionBlockStyle from "../styles/functionBlockStyle.json"

export class FunctionBlock {

    private readonly id: string
    private readonly label: string
    private readonly input: (Pin)[]
    private readonly output: (Pin)[]
    private readonly _cy: Core
    
    constructor(id: string, label: string, input: (Pin)[], output: (Pin)[]) {
        this.id = id
        this.label = label
        this.input = input
        this.output = output
        this._cy = Graph.getInstance().getCy()
    }

    public getID(): string {
        return this.id
    }

    public getLabel(): string {
        return this.label
    }

    public getInput(): Pin[] {
        return this.input
    }

    public getOutput(): Pin[] {
        return this.output
    }

    public static getFunctionBlockStyle(label: string) {
        functionBlockStyle.style.label = label
        return functionBlockStyle.style
    }
}
