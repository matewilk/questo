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
  default     = "eu01xx20ac02d4a1fd291b3561c4745aFFFFNRAL"
}

variable "pixie-api-key" {
  sensitive   = true
  description = "New Relic Pixie Api Key"
  default     = "px-api-06c8dc62-bc77-49f6-a154-82e8b0ad2f45"
}

variable "pixie-deploy-key" {
  sensitive   = true
  description = "New Relic Pixie Deploy Key"
  default     = "px-dep-1e362367-c5cd-40b5-9422-a822111d67f0"
}
