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
  # in other words - run infinitely
  wait_for_completion = false

  spec {
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

          env_from {
            config_map_ref {
              optional = false
              name = kubernetes_config_map.questo_dynamodb_configmap.metadata.0.name
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

resource "kubernetes_deployment" "questo_dynamodb" {
  metadata {
    name = "questo-dynamodb-deployment"
    labels = {
      app = "QuestoDynamoDb"
    }
    namespace = kubernetes_namespace.minikube-namespace.metadata.0.name
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "QuestoDynamoDb"
      }
    }

    template {
      metadata {
        labels = {
          app = "QuestoDynamoDb"
        }
      }
      spec {
        container {
          name = "questo-dynamodb-container"
          image = "amazon/dynamodb-local"

          port {
            protocol = "TCP"
            container_port = 8000
            host_ip = 8000
            host_port = 8000
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "questo_dynamodb_service" {
  metadata {
    name = "questo-dynamodb-service"
    namespace = kubernetes_namespace.minikube-namespace.metadata.0.name
  }
  spec {
    selector = {
      app = kubernetes_deployment.questo_dynamodb.metadata.0.labels.app
    }

    port {
      protocol = "TCP"
      port = 8000
      target_port = 8000
    }
  }
}

resource "kubernetes_config_map" "questo_dynamodb_configmap" {
  metadata {
    name = "questo-dynamodb-configmap"
    namespace = kubernetes_namespace.minikube-namespace.metadata.0.name
  }

  data = {
    DB_URL = "http://${kubernetes_service.questo_dynamodb_service.metadata.0.name}:8000"
    DB_TABLE_NAME = "Questo"
    AWS_REGION = "local"
    AWS_ACCESS_KEY_ID = "local"
    AWS_SECRET_ACCESS_KEY = "local"
    QUESTION_PREFIX = "QUE"
    ANSWER_PREFIX = "ANS"
    USER_PREFIX = "USR"
  }
}

resource "kubernetes_job" "questo_dynamodb_create_table" {
  depends_on = [
    kubernetes_deployment.questo_dynamodb
  ]
  metadata {
    name = "questo-dybanamodb-create-table-job"
    labels = {
      app = "QuestoDynamoDb"
    }
    namespace = kubernetes_namespace.minikube-namespace.metadata.0.name
  }

  spec {
    template {
      metadata {
        labels = {
          app = "QuestoDynamoDb"
        }
      }

      spec {
        restart_policy = "Never"

        container {
          name = "questo-dynamodb-create-table-container"
          image = "dynamodb-create-table-image"

          image_pull_policy = "Never"
        }
      }
    }
  }
}
