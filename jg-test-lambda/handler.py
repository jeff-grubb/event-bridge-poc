# Only prints out the content of the event that was passed to the lambda.
# Functional equivalent of a lambda echo?

import json


def lambda_handler(event, context):
    print(event)
    return {'statusCode': 200, 'body': json.dumps(event)}
