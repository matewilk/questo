terraform {
  backend "s3" {}
}

#data "terraform_remote_state" "dynamodb-state" {
#  backend = "s3"
#  config = {
#    encrypt = true
#    bucket  = var.questo-infra-bucket
#    region  = var.region
#    key     = "tfstates/${var.env}/dynamodb/ddb.tfstate"
#  }
#}
