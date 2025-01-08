import { DynamoDBRecord } from 'aws-lambda'
import { Config as ConfigInterface } from '@foxcorp/lib-fox-config-base'
import { Logger } from '../Logger/Logger'
import { Response } from '../Response/Response'
import { SendEventBridgeBus } from '../Actions/SendEventBridgeBus'

export class Controller {
    private static requestType: string
    private static records: any[]
    private readonly config: ConfigInterface // Why static vs readonly

    constructor(config: ConfigInterface) {
        this.config = config
    }

    protected async executeRequest(event: DynamoDBRecord) {
        const a = new SendEventBridgeBus(this.config)
        return await a.execute(event)
    }

    protected async routeEvent(event: DynamoDBRecord) {
        const recordSize = event.dynamodb?.SizeBytes ?? -1
        const maxBytes = this.config.getField("MAX_EVENT_SIZE")

        if(recordSize > maxBytes) {
            Logger.info("event too large to send over eventbridge")

            // TODO: route dynamo content to S3, and then execute the request to EventBridge
        }
        return await this.executeRequest(event)
    }

    public async getResponse(event: DynamoDBRecord[]) {
        Logger.info('Initial Event', event)

        let responses: Response[] = []

        /*
        https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-target.html#pipes-targets-specifics-lambda-stepfunctions
        Lambda and Step Functions do not have a batch API. To process batches of events from a pipe source,
        the batch is converted to a JSON array and passed to as input to the Lambda or Step Functions target.

        jg - Even though the function definition is an array of dynamodb records, if a non-array is passed, no error is raised
        */

        if(!Array.isArray(event)) {
            responses.push(new Response(false, 400, undefined, "Input not an array of objects"))
        }
        else {
            for (const item of event) {
                responses.push(await this.routeEvent(item))
            }
        }

        return responses
    }
}
