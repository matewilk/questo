resource "helm_release" "redis-chart" {
  name = "redis-${var.env}"

  repository = "https://charts.bitnami.com/bitnami"
  chart = "redis"
  namespace = "kube-system"

  set {
    name  = "master.containerPort"
    value = "6379"
  }

  set {
    name  = "master.extraEnvVars"
    value = ["ALLOW_EMPTY_PASSWORD=true"]
  }

  set {
    name  = "replica.replicaCount"
    value = "2"
  }
}

