import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { sprintf } from 'sprintf-js';
import { EventBridgeResponse } from '../Response/EventBridgeResponse'
import { BaseAction } from './BaseAction'


export class SendEventBridgeBus extends BaseAction {
    protected eventBridgeBus: any
    protected client: any // Why do I need to define this here?

    constructor(config: any) {
        super(config)
        this.eventBridgeBus = this.setEventBridgeBus()
        this.createClient() // Why do I need to instantiate this here?
    }

    protected setEventBridgeBus() {
        return this.config.getField("TARGET_BUS_ARN")
    }

    protected createClient() {
        this.client = new EventBridgeClient(
            { region: this.config.getField("AWS_REGION_NAME") }
        );
    }

    protected async executeAction(payload: any) : Promise<EventBridgeResponse> {
        console.log(payload)

        const eventParams = {
            Entries: [
                {
                    Source: sprintf("%s-%s-spark-v3-content-publisher",
                        this.config.getField("ENVIRONMENT"),
                        this.config.getField("BUSINESS_UNIT")),
                    DetailType: "spark-event-bridge",
                    Detail: JSON.stringify(payload), // TODO - for events larger than 256K
                    EventBusName: this.eventBridgeBus
                }
            ]
        }

        const command = new PutEventsCommand(eventParams);

        try {
          const response = await this.client.send(command);
          console.log(response)
          return new EventBridgeResponse(true, response)

        } catch (error) {
            console.log(error)
            return new EventBridgeResponse(false, error)
        }
    }
}
