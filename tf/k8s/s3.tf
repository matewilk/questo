resource "aws_s3_bucket_object" "kube_config" {
  bucket = var.questo-infra-bucket
  key    = "${var.env}/eks/kubeconfig"
  content = module.eks.kubeconfig
  content_type = "text/*"
}
