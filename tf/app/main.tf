provider "aws" {
  region = var.region
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}

resource "kubernetes_namespace" "app-namespace" {
  metadata {
    name = "questo-namespace-${var.env}"
  }
}

resource "kubernetes_secret" "questo-server-secrets" {
  metadata {
    name      = "questo-server-secrets-${var.env}"
    namespace = kubernetes_namespace.app-namespace.metadata.0.name
  }

  data = {
    COOKIE_SESSION_SECRET = var.cookie_session_secret
    AWS_REGION            = var.region
    AWS_ACCESS_KEY_ID     = var.aws_access_key_id
    AWS_SECRET_ACCESS_KEY = var.aws_secret_access_key
    DB_TABLE_NAME         = var.db_table_name
  }
}

resource "kubernetes_deployment" "questo-server" {
  metadata {
    name = "questo-server-deployment-${var.env}"
    labels = {
      "app.kubernetes.io/name" = "QuestoServer-${var.env}"
    }
    namespace = kubernetes_namespace.app-namespace.metadata.0.name
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        "app.kubernetes.io/name" = "QuestoServer-${var.env}"
      }
    }

    template {
      metadata {
        labels = {
          "app.kubernetes.io/name" = "QuestoServer-${var.env}"
        }
      }
      spec {
        container {
          name  = "questo-server-container-${var.env}"
          image = "matewilk/questo-server-image-${var.env}"

          port {
            container_port = 4000
          }

          env_from {
            secret_ref {
              optional = false
              name     = kubernetes_secret.questo-server-secrets.metadata.0.name
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "questo-server-service" {
  metadata {
    name      = "questo-server-service-${var.env}"
    namespace = kubernetes_namespace.app-namespace.metadata.0.name
  }
  spec {
    selector = {
      "app.kubernetes.io/name" = lookup(kubernetes_deployment.questo-server.metadata.0.labels, "app.kubernetes.io/name")
    }

    port {
      port        = 80
      target_port = 4000
    }
    type = "NodePort"
  }
}

resource "kubernetes_ingress" "questo-server-ingress" {
  wait_for_load_balancer = true
  metadata {
    name      = "questo-server-ingress-${var.env}"
    namespace = kubernetes_namespace.app-namespace.metadata.0.name
    annotations = {
      "kubernetes.io/ingress.class"                  = "alb"
      "alb.ingress.kubernetes.io/target-type"        = "ip"
      "alb.ingress.kubernetes.io/scheme"             = "internet-facing"
      "alb.ingress.kubernetes.io/load-balancer-name" = "questo-server-alb-${var.env}"
      "alb.ingress.kubernetes.io/healthcheck-path"   = "/health"
    }
  }

  spec {
    rule {
      http {
        path {
          path = "/*"
          backend {
            service_name = kubernetes_service.questo-server-service.metadata.0.name
            service_port = 80
          }
        }
      }
    }
  }
}

output "load_balancer_hostname" {
  value = kubernetes_ingress.questo-server-ingress.status.0.load_balancer.0.ingress.0.hostname
}

output "load_balancer_name" {
  value = lookup(kubernetes_ingress.questo-server-ingress.metadata.0.annotations, "alb.ingress.kubernetes.io/load-balancer-name")
}
