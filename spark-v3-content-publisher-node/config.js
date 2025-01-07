const { BaseConfig } = require('@foxcorp/lib-fox-config-base')
const { join } = require('path')
const { existsSync } = require('fs')


module.exports = class config extends BaseConfig {
  setConfigPath() {
    const configDir = join(__dirname, 'config')
    const configLocalFile = join(configDir, 'config.local.json')
    const configFile = join(configDir, 'config.json')

    if (process.env.IS_OFFLINE === 'true' && existsSync(configLocalFile)) {
        return configLocalFile
    }

    return configFile
  }
}
