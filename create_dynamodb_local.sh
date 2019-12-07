#!/bin/sh

aws dynamodb create-table \
    --cli-input-json file://questo_db_definition.json \
    --endpoint-url http://dynamodb:8000 \
    --region eu-west-2
