import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda'
import { Config as ConfigInterface } from '@foxcorp/lib-fox-config-base'
import { Response } from '../Response/Response'
import { SendEventBridgeBus } from '../Actions/SendEventBridgeBus'


export class Controller {
    private static requestType: string
    private static records: any[]
    private readonly config: ConfigInterface // const vs readonly?

    constructor(config: ConfigInterface) {
        this.config = config
    }

    protected async executeRequest(event: any) {
        const a = new SendEventBridgeBus(this.config)
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
