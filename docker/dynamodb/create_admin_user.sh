#!/bin/bash

aws dynamodb put-item \
    --table-name Questo \
    --item file://admin_record.json \
    --endpoint-url http://dynamodb:8000 \
    --region eu-west-2
