const Export = require('./build/index.js')

module.exports.execute = async (event, context) => {

    const headers = {}

    try {
        const controller = new Export.Controller(event)
        const response = await controller.getResponse(event, context)
        console.log(response)
        return { headers, body: response }
    }
    catch (error) {
        console.error('Error: module.exports.execute >>', error)
        return { headers, body: [new Export.Response(false, error, 'Error: module.exports.execute >>')] }
    }
}
