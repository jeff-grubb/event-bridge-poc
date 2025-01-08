import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { sprintf } from 'sprintf-js';
import { EventBridgeResponse } from '../Response/EventBridgeResponse'
import { BaseAction } from './BaseAction'
import { Logger } from '../Logger/Logger'

export class SendEventBridgeBus extends BaseAction {
    protected eventBridgeBus: string

    constructor(config: any) {
        super(config)
        this.eventBridgeBus = this.setEventBridgeBus()
    }

    protected setEventBridgeBus() {
        return this.config.getField("TARGET_BUS_ARN")
    }

    protected createClient(): EventBridgeClient {
        return new EventBridgeClient(
            { region: this.config.getField("AWS_REGION_NAME") }
        );
    }

    protected async executeAction(payload: any) : Promise<EventBridgeResponse> {
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
          Logger.info(response)
          return new EventBridgeResponse(true, 200, response)

        } catch (error) {
            Logger.error(error)
            return new EventBridgeResponse(false, 500, error)
        }
    }
}
