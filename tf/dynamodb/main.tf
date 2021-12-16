provider "aws" {
  region = var.region
}

resource "aws_dynamodb_table" "questo-db-table" {
  hash_key       = "ID"
  range_key      = "RecordType"
  name           = var.db-table-name
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "ID"
    type = "S"
  }
  attribute {
    name = "RecordType"
    type = "S"
  }
  attribute {
    name = "text"
    type = "S"
  }
  attribute {
    name = "score"
    type = "N"
  }
  attribute {
    name = "type"
    type = "S"
  }
  attribute {
    name = "date"
    type = "N"
  }

  global_secondary_index {
    hash_key        = "RecordType"
    name            = "EntitiesIndex"
    projection_type = "ALL"
    read_capacity   = 1
    write_capacity  = 1
  }

  global_secondary_index {
    hash_key        = "RecordType"
    range_key       = "text"
    name            = "TextIndex"
    projection_type = "ALL"
    read_capacity   = 1
    write_capacity  = 1
  }

  global_secondary_index {
    hash_key        = "RecordType"
    range_key       = "score"
    name            = "ScoreIndex"
    projection_type = "ALL"
    read_capacity   = 1
    write_capacity  = 1
  }

  global_secondary_index {
    hash_key        = "RecordType"
    range_key       = "type"
    name            = "TypeIndex"
    projection_type = "ALL"
    read_capacity   = 1
    write_capacity  = 1
  }

  global_secondary_index {
    hash_key        = "RecordType"
    range_key       = "date"
    name            = "DateIndex"
    projection_type = "ALL"
    read_capacity   = 1
    write_capacity  = 1
  }

  tags = {
    Name        = "questo-dynamodb-table-${var.env}"
    Environment = var.env
  }
}

resource "aws_vpc_endpoint" "private-dynamodb" {
  service_name = "com.amazonaws.${var.region}.dynamodb"
  vpc_id       = data.terraform_remote_state.infrastructure.outputs.vpc_id
  policy       = <<POLICY
  {
    "Statement": [
        {
        "Action": "*",
        "Effect": "Allow",
        "Resource": "*",
        "Principal": "*"
        }
    ]
  }
  POLICY
}

resource "aws_vpc_endpoint_route_table_association" "private-dynamodb" {
  route_table_id  = data.terraform_remote_state.infrastructure.outputs.vpc_main_route_table_id
  vpc_endpoint_id = aws_vpc_endpoint.private-dynamodb.id
}
