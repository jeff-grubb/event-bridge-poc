const Export = require('./build/index.js')
const Configuration = require('./config.js')

module.exports.execute = async (event, context) => {
    console.log(event) // Output the original event for debugging

    const config = new Configuration()
    const headers = {
        "Content-Type": "application/json",
        "x-served-by": "spark-v3-content-publisher"
    }

    try {
        const controller = new Export.Controller(config)
        const response = await controller.getResponse(event, context)
        console.log(response)

        // This kinda breaks if there are more than 1 response.
        statusCode = 200
        for (const item of response) {
            const code = item.getStatusCode()
            if(code != statusCode) {
                statusCode = code
            }
        }

        return { statusCode: statusCode, headers, body: response }
    }
    catch (error) {
        console.log('Error: module.exports.execute >>', error)
        return { statusCode: 500, headers, body: [new Export.Response(false, error, 'Error: module.exports.execute >>')] }
    }
}
