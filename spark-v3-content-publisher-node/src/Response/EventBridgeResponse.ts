import { Response } from './Response'

export class EventBridgeResponse extends Response {
    constructor(success: boolean, statusCode?: number, data?: any, message?: string) {
        super(success, statusCode, data, message || 'EventBridgeResponse Response')
    }
}
