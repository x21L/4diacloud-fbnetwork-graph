import pinStyle from "../styles/pinsStyle.json"

export class Pin {
    private readonly connectionType: ('input' | 'output')
    private readonly id: string
    private readonly parentID: string
    private readonly label: string
    private readonly type: ('event' | 'data')

    constructor(connectionType: ('input' | 'output'), id: string, parentID: string, label: string, type: ('event' | 'data')) {
        this.connectionType = connectionType
        this.id = id
        this.parentID = parentID
        this.type = type
        this.label = label
    }

    public getID(): string {
        return this.id
    }

    public getConnectionType(): ('input' | 'output') {
        return this.connectionType
    }

    public getType(): ('event' | 'data') {
        return this.type
    }

    public getPinStyle(): Object {
        if (this.type === 'event') {
            pinStyle.style.backgroundColor = 'red'
        } else {
            pinStyle.style.backgroundColor = 'blue'
        }

        if (this.connectionType === 'input') {
            pinStyle.style["text-halign"] = 'right'
        } else {
            pinStyle.style["text-halign"] = 'left'
        }

        pinStyle.style.label = this.label
        return pinStyle.style
    }
}