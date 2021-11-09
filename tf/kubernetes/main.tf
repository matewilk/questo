provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_namespace" "minikube-namespace" {
  metadata {
    name = "minikube-local-ns"
  }
}

# use "job" for local and "deployment" for remote
resource "kubernetes_job" "questo_server" {
  metadata {
    name = "questo-server-deployment"
    labels = {
      app = "QuestoServer"
    }
    namespace = kubernetes_namespace.minikube-namespace.metadata.0.name
  }

  # only for "job"s
  wait_for_completion = false

  spec {
# commented out lines are not supported by "job" (only "deployment")
#    replicas = 1
#    selector {
#      match_labels = {
#        app = "QuestoServer"
#      }
#    }
    template {
      metadata {
        labels = {
          app = "QuestoServer"
        }
      }
      spec {
        # for local deployment
        restart_policy = "Never"

        container {
          name = "questo-server-container"
          image = "questo-server-image"

          # for local deployment
          image_pull_policy = "Never"

          port {
            container_port = 4000
          }

          resources {
            limits = {
              cpu = "0.5"
              memory = "512Mi"
            }
            requests = {
              cpu = "250m"
              memory = "50Mi"
            }
          }
        }
      }
    }
  }
}

# access service (external ip) by running 'minikube service {service name}`
# or use `minikube tunnel` in a separate terminal window
resource "kubernetes_service" "questo_server_service" {
  metadata {
    name = "questo-server-service"
    namespace = kubernetes_namespace.minikube-namespace.metadata.0.name
  }
  spec {
    selector = {
      app = kubernetes_job.questo_server.metadata.0.labels.app
    }

    port {
      protocol = "TCP"
      port = 4000
      target_port = 4000
      node_port = 30001
    }

    type = "LoadBalancer"
  }
}
