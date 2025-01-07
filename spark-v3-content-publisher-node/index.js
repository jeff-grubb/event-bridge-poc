const Export = require('./build/index.js')
const Configuration = require('./config.js')

module.exports.execute = async (event, context) => {
    const config = new Configuration()
    const headers = {}

    try {
        const controller = new Export.Controller(config)
        const response = await controller.getResponse(event, context)
        console.log(response)
        return { headers, body: response }
    }
    catch (error) {
        console.error('Error: module.exports.execute >>', error)
        return { headers, body: [new Export.Response(false, error, 'Error: module.exports.execute >>')] }
    }
}
