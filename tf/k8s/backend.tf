terraform {
  # run:  terraform init -reconfigure -backend-config=dev.tfbackend
  backend "s3" {}
}

data "terraform_remote_state" "cluster-state" {
  backend = "s3"
  config = {
    encrypt = true
    bucket  = var.questo-infra-bucket
    region  = var.region
    key     = "tfstates/${var.env}/eks/cluster.tfstate"
  }
}