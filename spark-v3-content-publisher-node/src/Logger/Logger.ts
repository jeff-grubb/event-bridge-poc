import { handlers, processors, SparkLogger } from '@foxcorp/lib-fox-logger'

const logger = new SparkLogger('Content Publisher Lambda V3')
const consoleHandler = new handlers.ConsoleHandler('DEBUG') // TODO: environment variable control this?

logger.pushHandler(consoleHandler)
logger.pushProcessor(processors.trace)

export { logger as Logger }
