provider "aws" {
  region = var.region
}

provider "kubernetes" {
  config_path = "./${data.local_file.kubeconfig.filename}"
}

resource "kubernetes_namespace" "app-namespace" {
  depends_on = [data.local_file.kubeconfig]
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
