import { BaseConfig } from '@foxcorp/lib-fox-config-base'


interface ConfigSchema { // appears to be pointless
    JG_TEST: string
}

export interface ConfigInterface extends BaseConfig {
    //getField(field: keyof ConfigSchema): ConfigSchema[keyof ConfigSchema] // this gives an error, not sure why
    getField(field: keyof ConfigSchema): any
    getAllFields(): ConfigSchema
}
