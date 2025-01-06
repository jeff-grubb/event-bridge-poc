import { Response } from './Response'

export class EventBridgeResponse extends Response {
    constructor(success: boolean, data?: any, message?: string) {
        super(success, data, message || 'EventBridgeResponse Response')
    }
}
