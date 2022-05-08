import { Connection } from "./elements/connection"
import { FunctionBlock } from "./elements/functionblock"
import { Graph } from "./graph"
import { Pin } from "./elements/pin"

export class Main {

    createTestGraph() {
        var inputPin1: Pin = new Pin('input', 'inputEvent', 'ID123', 'input event', 'event')
        var inputPin2: Pin = new Pin('input', 'inputData', 'ID123', 'input data', 'data')
        let inputs: Pin[] = [inputPin1, inputPin2]

        var outputPin1: Pin = new Pin('output', 'outputEvent', 'ID123', 'output event', 'event')
        var outputPin2: Pin = new Pin('output', 'outputData', 'ID123', 'output data', 'data')
        let outputs: Pin[] = [outputPin1, outputPin2]
        
        const fb = new FunctionBlock("ID123", "my first function block", inputs, outputs)
        Graph.getInstance().addFunctionBlock(fb)

        // second block
        var inputPin4: Pin = new Pin('input', 'inputEvent2', 'ID123', 'input event', 'event')
        var inputPin5: Pin = new Pin('input', 'inputData2', 'ID123', 'input data', 'data')
        let inputs2: Pin[] = [inputPin4, inputPin5]

        var outputPin4: Pin = new Pin('output', 'outputEvent2', 'ID123', 'output event', 'event')
        var outputPin5: Pin = new Pin('output', 'outputData2', 'ID123', 'output data', 'data')
        let outputs2: Pin[] = [outputPin4, outputPin5]

        const fb2 = new FunctionBlock("ID456", "my second function Block", inputs2, outputs2)
        Graph.getInstance().addFunctionBlock(fb2)
        Graph.getInstance().addConnection(new Connection('conn1', 'outputEvent', 'inputEvent2'))
        Graph.getInstance().addConnection(new Connection('conn2', 'outputData', 'inputData2'))
    }

    layout() {
        Graph.getInstance().runKlayLayout()
    }
}