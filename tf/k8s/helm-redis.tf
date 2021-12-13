resource "helm_release" "redis-chart" {
  name = "redis-${var.env}"

  repository = "https://charts.bitnami.com/bitnami"
  chart = "redis"
  namespace = "kube-system"

  set {
    name  = "master.containerPort"
    value = "6379"
  }
}

