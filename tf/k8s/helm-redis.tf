variable "extraEnvVars" {
  description = "extra redis env vars"
  type = list(object({
    name  = any
    value = string
  }))
  default = [{
    name : "ALLOW_EMPTY_PASSWORD",
    value : "yes"
  }]
}

resource "helm_release" "redis-chart" {
  name = "redis-${var.env}"

  repository       = "https://charts.bitnami.com/bitnami"
  chart            = "redis"
  namespace        = "redis"
  create_namespace = true

  set {
    name  = "auth.enabled"
    value = "false"
  }

  set {
    name  = "master.containerPort"
    value = "6379"
  }

  set {
    name  = "master.extraEnvVars"
    value = yamlencode(var.extraEnvVars)
  }

  set {
    name  = "master.persistence.size"
    value = "1Gi"
  }

  set {
    name  = "replica.extraEnvVars"
    value = yamlencode(var.extraEnvVars)
  }

  set {
    name  = "replica.persistence.size"
    value = "1Gi"
  }

  set {
    name  = "replica.replicaCount"
    value = "2"
  }
}

