variable "env" {
  default = "dev"
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "17.23.0"

  cluster_name    = local.cluster_name
  cluster_version = "1.21"
  subnets         = module.vpc.private_subnets

  tags = {
    Environment = var.env
  }

  vpc_id = module.vpc.vpc_id

  workers_group_defaults = {
    root_volume_type = "gp2"
  }

  worker_groups = [
    {
      name                          = "worker-group-one"
      instance_type                 = "t2.small"
      additional_userdata           = "echo foo worker1"
      additional_security_group_ids = [aws_security_group.worker_group_mgmt_one.id]
      asg_desired_capacity          = 1
      asg_max_size                  = 1
    }
#    {
#      name                          = "worker-group-two"
#      instance_type                 = "t2.small"
#      additional_userdata           = "echo foo worker2"
#      additional_security_group_ids = [aws_security_group.worker_group_mgmt_two.id]
#      asg_desired_capacity          = 1
#      asg_max_size                  = 1
#    }
  ]

  workers_additional_policies = [aws_iam_policy.worker_policy.arn]
}

resource "aws_iam_policy" "worker_policy" {
  name        = "aws-load-balancer-controller-iam-policy"
  description = "Worker policy for ALB Ingress"

  policy = file("iam-policy.json")
}

data "aws_eks_cluster" "cluster" {
  name = module.eks.cluster_id
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_id
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}
