import json
import boto3
import builtins
import os

eventbridge = boto3.client('events')

ENV = os.environ.get("ENV", None)
BUSINESS_UNIT = os.environ.get("BUSINESS_UNIT", None)
TARGET_BUS_ARN = os.environ.get("TARGET_BUS_ARN", None)


# TODO probably need to lock this down to dynamo events, unless we want to expand this to other types of messages
def lambda_handler(events, context):
    if ENV is None or BUSINESS_UNIT is None or TARGET_BUS_ARN is None:
        raise "Environment variables can not be None"

    print(events)
    entries = []

    for event in events:
        new_event = {
            'Source': "{0}-{1}-spark-v3-content-publisher".format(ENV, BUSINESS_UNIT),
            'DetailType': 'dynamodb',
            'Detail': json.dumps(event),
            'EventBusName': TARGET_BUS_ARN
        }
        entries.append(new_event)

    try:
        # Put the events on the bus
        # todo: this will not throw an exception when the event is malformed, need to check the response
        response = eventbridge.put_events(
            Entries=entries
        )
        print(str(response))

        return {'statusCode': 200, 'body': str(response)}

    except BaseException as e:
        print(e)
        return {'statusCode': 500, 'body': str(e)}
