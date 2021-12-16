variable "region" {
  default = "eu-west-2"
}

variable "env" {
  default = "dev"
}

variable "questo-infra-bucket" {
  default = "questo-infra"
}

variable "cookie_session_secret" {
  sensitive = true
}

variable "aws_access_key_id" {
  sensitive = true
}

variable "aws_secret_access_key" {
  sensitive = true
}

variable "db_table_name" {}
