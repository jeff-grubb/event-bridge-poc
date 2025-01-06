import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda'
import { Response } from '../Response/Response'
import { SendEventBridgeBus } from '../Actions/SendEventBridgeBus'

export class Controller {
    private static requestType: string
    private static records: any[]

    constructor() {}

    protected async executeRequest(event: any) {
        // temp, everything is just going to be a dynamo message and sent to the bus.
        const a = new SendEventBridgeBus()
        return await a.execute(event)
    }

    /*
    protected async routeEvent(item: any) {
        if(item?.eventSource == "aws:dynamodb") {
            console.log("Dynamo message!")
        }

        if(item?.detail?.eventSource == "aws:dynamodb") {
            console.log("dynamo message!")
        }

        return new Response(true)
    }
    */

    public async getResponse(event: DynamoDBStreamEvent) {
        let responses: Response[] = []

        if(Array.isArray(event)) {

            for (const item of event) {
                responses.push(await this.executeRequest(item))
            }

            // cant do this with async? Inline function requires a static method on the class?
            /*
            event.forEach(function (item: any) {
                responses.push(Controller.executeRequest(item))
            })
            */
        } else {
            responses.push(await this.executeRequest(event))
        }

        return responses
    }
}
