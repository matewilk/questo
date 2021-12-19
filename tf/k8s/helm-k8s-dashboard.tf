resource "kubernetes_namespace" "k8s-dashboard-ns" {
  metadata {
    name = "k8s-dashboard-${var.env}"
  }
}

resource "kubernetes_service_account" "k8s-service-account" {
  metadata {
    name = "k8s-dashboard-admin"
    namespace = kubernetes_namespace.k8s-dashboard-ns.metadata.0.name
  }
}

resource "kubernetes_cluster_role_binding" "k8s-role-binding" {
  metadata {
    name = "admin-user"
  }
  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "ClusterRole"
    name      = "cluster-admin"
  }
  subject {
    kind = "ServiceAccount"
    name = kubernetes_service_account.k8s-service-account.metadata.0.name
    namespace = kubernetes_namespace.k8s-dashboard-ns.metadata.0.name
  }
}

resource "helm_release" "k8s-dashboard" {
  name = "k8s-dashboard-${var.env}"

  repository       = "https://kubernetes.github.io/dashboard/"
  chart            = "kubernetes-dashboard"
  namespace        = kubernetes_namespace.k8s-dashboard-ns.metadata.0.name
}

#
# Once the dashboard is deployed run the following to get the login token:
# kubectl -n k8s-dashboard-dev get secret $(kubectl -n k8s-dashboard-dev get sa/k8s-dashboard-admin -o jsonpath="{.secrets[0].name}") -o go-template="{{.data.token | base64decode}}"
#
# Next run the 'kubectl proxy'
#
# Navigate to the dashboard:
# http://localhost:8001/api/v1/namespaces/k8s-dashboard-dev/services/https:k8s-dashboard-dev-kubernetes-dashboard:https/proxy/#/cluster?namespace=default
#
# use the token from step 1 to login
