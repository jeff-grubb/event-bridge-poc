import { join } from 'path'
import { BaseConfig } from '@foxcorp/lib-fox-config-base'
import { ConfigInterface } from '../Types/Config'


export class Config extends BaseConfig implements ConfigInterface {
    public setConfigPath(): string {
        return join(__dirname, '..', '..', 'config', 'config.json')
    }
}
