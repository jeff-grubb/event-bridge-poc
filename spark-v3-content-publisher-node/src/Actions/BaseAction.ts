import { Config as ConfigInterface } from '@foxcorp/lib-fox-config-base'
import { Response } from '../Response/Response'

export abstract class BaseAction {
    protected client: any
    protected readonly config: ConfigInterface

    constructor(config: ConfigInterface) {
        this.config = config
        this.client = this.createClient()
    }

    public async execute(payload: any) {
        try {
            return await this.executeAction(payload)
        } catch(error: any) {
            return new Response(false, error)
        }
    }

    protected abstract createClient(): any

    protected abstract executeAction(payload: any): any
}
