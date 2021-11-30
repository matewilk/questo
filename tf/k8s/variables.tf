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

variable "eks-admin" {
  default = "eks-admin"
  description = "aws eks admin username"
}

variable "eks-developer" {
  default = "eks-developer"
  description = "aws eks developer username"
}

variable "eks-admin-role" {
  default = "eks-admin-role"
  description = "aws eks admin role "
}

variable "eks-developer-role" {
  default = "eks-developer-role"
  description = "aws eks developer role"
}


