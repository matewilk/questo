data "aws_s3_bucket_object" "kube_config" {
  bucket = var.questo-infra-bucket
  key    = "${var.env}/eks/kubeconfig"
}

resource "local_file" "kubeconfig" {
  content  = data.aws_s3_bucket_object.kube_config.body
  filename = "kubeconfig"
}

data "local_file" "kubeconfig" {
  depends_on = [local_file.kubeconfig]
  filename   = "kubeconfig"
}
