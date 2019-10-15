resource "aws_dynamodb_table" "questo_table" {
  name = "Questo"
  billing_mode = "PROVISIONED"
  read_capacity = 1
  write_capacity = 1
  hash_key = "ID"
  range_key = "type"

  attribute {
    name = "ID"
    type = "S"
  }

  attribute {
    name = "type"
    type = "S"
  }

  tags = {
    Name = "questo_dynamodb_table"
    Environment = "local"
  }
}
