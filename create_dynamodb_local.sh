#!/bin/sh

aws dynamodb create-table \
    --table-name Questo \
    --attribute-definitions \
        AttributeName=ID,AttributeType=S AttributeName=type,AttributeType=S \
    --key-schema AttributeName=ID,KeyType=HASH AttributeName=type,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --endpoint-url http://dynamodb:8000 \
    --region eu-west-2
