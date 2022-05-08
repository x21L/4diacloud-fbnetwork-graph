import { Core } from "cytoscape"
import { Graph } from "../graph"
import connectionStyle from "../styles/connectionStyle.json"
import connectionSelectedStyle from "../styles/connectionSelectedStyle.json"

export class Connection {
    private readonly id: string
    private readonly sourceID: string
    private readonly targetID: string
    private readonly _cy: Core

    constructor(id: string, sourceID: string, targetID: string) {
        this.id = id
        this.sourceID = sourceID
        this.targetID = targetID
        this._cy = Graph.getInstance().getCy()
    }

    public getID(): string {
        return this.id
    }

    public getSource(): string {
        return this.sourceID
    }

    public getTarget(): string {
        return this.targetID
    }

    public static getConnectionStyle() {
        return connectionStyle
    }

    public static getConnectionSelectedStyle() {
        return connectionSelectedStyle
    }
}