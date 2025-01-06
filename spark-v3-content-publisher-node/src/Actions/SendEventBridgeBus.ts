import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { EventBridgeResponse } from '../Response/EventBridgeResponse'

import { BaseAction } from './BaseAction'
import { sprintf } from 'sprintf-js';

export class SendEventBridgeBus extends BaseAction {

    protected eventBridgeBus: any
    protected client: any // Why do I need to define this here?

    // todo - config
    constructor() {
        super(/*config*/)
        this.eventBridgeBus = this.setEventBridgeBus()
        this.createClient() // Why do I need to instantiate this here?
    }

    // todo - config
    protected setEventBridgeBus() {
        return "arn:aws:events:us-east-1:008971673418:event-bus/dev-gen-spark-v3-eventbridge-bus"
    }

    // todo - config
    protected createClient() {
        this.client = new EventBridgeClient({ region: "us-east-1" });
    }

    protected async executeAction(payload: any) : Promise<EventBridgeResponse> {
        console.log(payload)

        const eventParams = {
            Entries: [
                {
                    Source: sprintf("%s-%s-spark-v3-content-publisher", "dev", "fs"),
                    DetailType: "spark-event-bridge",
                    Detail: JSON.stringify(payload),
                    EventBusName: this.eventBridgeBus
                }
            ]
        }

        console.log(eventParams)

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
