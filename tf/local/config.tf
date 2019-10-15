provider "aws" {
  access_key = "1234567890"
  secret_key = "1234567890"
  region = "eu-west-2"

  endpoints {
    dynamodb = "http://localhost:8000"
  }
}
