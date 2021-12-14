data "terraform_remote_state" "cluster" {
  backend = "s3"
  config = {
    encrypt = true
    bucket  = var.questo-infra-bucket
    region  = var.region
    key     = "tfstates/${var.env}/eks/cluster.tfstate"
  }
}

data "aws_eks_cluster" "cluster" {
  name = data.terraform_remote_state.cluster.outputs.cluster_name
}

data "aws_eks_cluster_auth" "cluster" {
  name = data.terraform_remote_state.cluster.outputs.cluster_name
}

data "kubernetes_service" "redis-master" {
  metadata {
    name      = "redis-${var.env}-master"
    namespace = "redis"
  }
}
