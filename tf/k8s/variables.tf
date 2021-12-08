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

variable "nr-license-key" {
  sensitive   = true
  description = "New Relic license key to digest K8s data"
}

variable "pixie-api-key" {
  sensitive   = true
  description = "New Relic Pixie Api Key"
}

variable "pixie-deploy-key" {
  sensitive   = true
  description = "New Relic Pixie Deploy Key"
}
