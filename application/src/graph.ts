import cytoscape, { Core } from 'cytoscape'
import { FunctionBlock } from './elements/functionblock'
//@ts-expect-error
import klay from 'cytoscape-klay';
import { Pin } from './elements/pin';
import { Connection } from './elements/connection';
//@ts-expect-error
import gridGuide from 'cytoscape-grid-guide';
cytoscape.use(klay)
cytoscape.use(gridGuide)

export class Graph {
    private static instance: Graph;
    private readonly _cy: Core

    constructor() {
        if (Graph.instance) {
            throw new Error("Error - use Singleton.getInstance()");
        }

        this._cy = cytoscape({
            container: document.getElementById('cy'),
            wheelSensitivity: 0.2
        })

        // set up connection style
        //@ts-expect-error
        this._cy.style().selector('edge:selected').style({
            "line-color": "#ff0000",
            "label": "data(id)",
            "font-size": 13,
            "text-opacity": 1,
            "text-rotation": "autorotate",
            "color": "#ff0000",
            "font-weight": "bold",
            "text-background-shape": "round-rectangle",
            "text-background-opacity": 1,
            "text-background-padding": 2
        }).update()
        //@ts-expect-error
        this._cy.style().selector('edge').style({
            "line-color": "grey",
            "curve-style": "taxi",
            "source-endpoint": "outside-to-node",
            "target-endpoint": "inside-to-node"
        }).update()
    }

    static getInstance(): Graph {
        Graph.instance = Graph.instance || new Graph()
        return Graph.instance
    }

    public getCy(): Core {
        return this._cy
    }

    public addFunctionBlock(functionBlock: FunctionBlock): void {
        // add root function block
        var functionBlockData = new Data(functionBlock.getID(), 'functionblock', 'functionblock')
        var functionBlockNode = new Node('nodes', functionBlockData, FunctionBlock.getFunctionBlockStyle(functionBlock.getLabel()))
        this._cy.add({
            group: functionBlockNode.group,
            data: functionBlockNode.data,
        })

        var currentFunctionBlockSelector = 'node[id="' + functionBlock.getID() + '"]'
        //@ts-expect-error
        this._cy.style().selector(currentFunctionBlockSelector).style(functionBlockNode.style).update()

        // add the pins
        this.addPins(functionBlock.getInput(), functionBlock.getID())
        this.addPins(functionBlock.getOutput(), functionBlock.getID())

        // layout the pins
        this.setupFunctionBlockInnerLayout(currentFunctionBlockSelector)

        // layout graph
        this.runKlayLayout();

        // enable grid
        //@ts-expect-error
        this._cy.gridGuide({
            gridSpacing: 20,
            snapToGridOnRelease: true, // Snap to grid on release
            snapToGridDuringDrag: true, // Snap to grid during drag
        })
    }

    public runKlayLayout() {

        var options = {
            name: 'klay',
            nodeDimensionsIncludeLabels: false, // Boolean which changes whether label dimensions are included when calculating node dimensions
            fit: false, // Whether to fit
            padding: 20, // Padding on fit
            animate: true, // Whether to transition the node positions
            animationDuration: 500, // Duration of animation in ms if enabled
            animationEasing: undefined, // Easing of animation if enabled
            ready: undefined, // Callback on layoutready
            stop: undefined, // Callback on layoutstop
            klay: {
                addUnnecessaryBendpoints: false, // Adds bend points even if an edge does not change direction.
                aspectRatio: 1.6, // The aimed aspect ratio of the drawing, that is the quotient of width by height
                borderSpacing: 20, // Minimal amount of space to be left to the border
                compactComponents: false, // Tries to further compact components (disconnected sub-graphs).
                crossingMinimization: 'LAYER_SWEEP', // Strategy for crossing minimization.
                /* LAYER_SWEEP The layer sweep algorithm iterates multiple times over the layers, trying to find node orderings that minimize the number of crossings. The algorithm uses randomization to increase the odds of finding a good result. To improve its results, consider increasing the Thoroughness option, which influences the number of iterations done. The Randomization seed also influences results.
                INTERACTIVE Orders the nodes of each layer by comparing their positions before the layout algorithm was started. The idea is that the relative order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive layer sweep algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
                cycleBreaking: 'GREEDY', // Strategy for cycle breaking. Cycle breaking looks for cycles in the graph and determines which edges to reverse to break the cycles. Reversed edges will end up pointing to the opposite direction of regular edges (that is, reversed edges will point left if edges usually point right).
                /* GREEDY This algorithm reverses edges greedily. The algorithm tries to avoid edges that have the Priority property set.
                INTERACTIVE The interactive algorithm tries to reverse edges that already pointed leftwards in the input graph. This requires node and port coordinates to have been set to sensible values.*/
                direction: 'RIGHT', // Overall direction of edges: horizontal (right / left) or vertical (down / up)
                /* UNDEFINED, RIGHT, LEFT, DOWN, UP */
                edgeRouting: 'ORTHOGONAL', // Defines how edges are routed (POLYLINE, ORTHOGONAL, SPLINES)
                edgeSpacingFactor: 0.5, // Factor by which the object spacing is multiplied to arrive at the minimal spacing between edges.
                feedbackEdges: false, // Whether feedback edges should be highlighted by routing around the nodes.
                fixedAlignment: 'NONE', // Tells the BK node placer to use a certain alignment instead of taking the optimal result.  This option should usually be left alone.
            }
        }

        this._cy.nodes('node[type="functionblock"]').layout(options).run();
    }

    public addConnection(connection: Connection): void {
        var connectionData = new DataConnection(connection.getID(), connection.getSource(), connection.getTarget())
        var connectionNode = new Node('edges', connectionData, undefined)

        this._cy.add({
            group: connectionNode.group,
            data: connectionNode.data,
        })

        //@ts-expect-error
        this._cy.style().selector('edge').style({
            'target-arrow-shape': 'triangle',
            'target-arrow-color': 'grey',
        }).update()
    }

    private setupFunctionBlockInnerLayout(currentFunctionBlockSelector: string) {
        var currentFunctionBlock = this._cy.nodes(currentFunctionBlockSelector)
        currentFunctionBlock.layout({
            name: 'grid',
            cols: 2,
        }).run();

        currentFunctionBlock.descendants().layout({
            name: 'grid',
            cols: 2,
            rows: 2,
            fit: true,
            position: function (node) {
                return {
                    row: node.data('row'),
                    col: node.data('col')
                }
            }
        }).run()
    }

    private addPins(pins: Pin[], parentID?: string): void {
        for (let pin of pins) {
            var nodeData = new Data(pin.getID(), pin.getType(), pin.getConnectionType(), parentID)
            var node = new Node('nodes', nodeData, pin.getPinStyle())
            this._cy.add({
                group: node.group,
                data: node.data,
                grabbable: false
            })
            //@ts-expect-error
            this._cy.style().selector('node[id="' + pin.getID() + '"]').style(node.style).update()
        }
    }
}

class Node {
    group: ('nodes' | 'edges')
    data: (Data | DataConnection)
    style: (Object | undefined)

    constructor(group: ('nodes' | 'edges'), data: (Data | DataConnection), style: (Object | undefined)) {
        this.group = group
        this.data = data
        this.style = style
    }

}

class Data {
    id: string
    type: ('functionblock' | 'data' | 'event')
    parent?: string
    static inputRow = 0
    static outputRow = 0
    col: number = 0
    row: number

    constructor(id: string, type: ('functionblock' | 'data' | 'event'), connectionType: ('input' | 'output' | 'functionblock'), parent?: string) {
        this.id = id
        this.type = type
        this.parent = parent

        switch (connectionType) {
            case 'input':
                this.col = 1
                this.row = Data.inputRow
                Data.inputRow++
                break;
            case 'output':
                this.col = 2
                this.row = Data.outputRow
                Data.outputRow++
                break
            case 'functionblock':
                this.row = 0
                this.col = 0
                break
        }
    }
}

class DataConnection {
    id: string
    source: string
    target: string

    constructor(id: string, source: string, target: string) {
        this.id = id
        this.source = source
        this.target = target
    }
}