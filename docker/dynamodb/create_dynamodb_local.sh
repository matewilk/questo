#!/bin/bash

DYNAMODB_ENDPOINT=$1 # for example: http://dynamodb:8000
DYNAMODB_REGION=$2 # for example: local or eu-west-2

aws dynamodb create-table \
    --cli-input-json file://questo_db_definition.json \
    --endpoint-url "$DYNAMODB_ENDPOINT" \
    --region "$DYNAMODB_REGION"
