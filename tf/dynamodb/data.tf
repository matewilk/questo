data "terraform_remote_state" "infrastructure" {
  backend = "s3"
  config = {
    encrypt = true
    bucket  = var.questo-infra-bucket
    region  = var.region
    key     = "tfstates/${var.env}/eks/cluster.tfstate"
  }
}
