variable "region" {
  default     = "eu-west-2"
  description = "AWS Region"
}

variable "env" {
  default = "dev"
}

variable "questo-infra-bucket" {
  default = "questo-infra"
}

variable "additional-eks-admin" {
  default     = "admin-dev"
  description = "aws user name to add to eks auth config map"
}
