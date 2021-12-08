#resource "kubernetes_namespace" "nr-namespace" {
#  metadata {
#    name = "newrelic-${var.env}"
#  }
#}

## install operator-lifecycle-manager on cluster
#resource "helm_release" "olm" {
#  name  = "olm"
#
#  repository = "https://gitlab.com/api/v4/projects/29255838/packages/helm/stable"
#  chart = "olm"
#  # namespace = kubernetes_namespace.nr-namespace.metadata.0.name
#}
#
# install Vizier on cluster
#resource "null_resource" "vizier_installation" {
#
#  provisioner "local-exec" {
#    command = <<EOT
#      echo "Downloading vizier config"
#      curl -L https://raw.githubusercontent.com/pixie-labs/pixie/main/k8s/operator/helm/crds/olm_crd.yaml -o vizier.yaml
#    EOT
#  }
#}
#
#data "kubectl_path_documents" "vizier_manifests" {
#  pattern = "./vizier.yaml"
#  depends_on = [null_resource.vizier_installation]
#}
#
#resource "kubectl_manifest" "vizier_controller" {
#  force_new = true
#  count     = 7 # length(data.kubectl_path_documents.vizier_manifests.documents)
#  yaml_body = element(data.kubectl_path_documents.vizier_manifests.documents, count.index)
##  for_each  = toset(data.kubectl_path_documents.vizier_manifests.documents)
##  yaml_body = each.value
#}

# finally install New Relic bundle (with Pixie)
#resource "helm_release" "nri-bundle" {
#  # depends_on = [kubectl_manifest.vizier_controller]
#  name = "nri-bundle"
#
#  repository = "https://helm-charts.newrelic.com"
#  chart      = "nri-bundle"
#  verify     = false
#  namespace = kubernetes_namespace.nr-namespace.metadata.0.name
#
#  set {
#    name  = "global.cluster"
#    value = data.aws_eks_cluster.cluster.name
#  }
#
#  set {
#    name  = "global.licenseKey"
#    value = var.nr-license-key
#  }
#
#  set {
#    name  = "infrastructure.enabled"
#    value = "true"
#  }
#
#  set {
#    name  = "kms.enabled"
#    value = "true"
#  }
#
#  set {
#    name  = "prometheus.enabled"
#    value = "false"
#  }
#
#  set {
#    name  = "kubeEvents.enabled"
#    value = "true"
#  }
#
#  set {
#    name  = "logging.enabled"
#    value = "true"
#  }
#
#  set {
#    name  = "newrelic-pixie.enabled"
#    value = "true"
#  }
#
#  set {
#    name  = "newrelic-pixie.apiKey"
#    value = var.pixie-api-key
#  }
#
#  set {
#    name  = "pixie-chart.enabled"
#    value = "true"
#  }
#
#  set {
#    name  = "pixie-chart.deployKey"
#    value = var.pixie-deploy-key
#  }
#
#  set {
#    name  = "pixie-chart.clusterName"
#    value = data.aws_eks_cluster.cluster.name
#  }
#
#  set {
#    name  = "newrelic-infra-operator.enabled"
#    value = "false"
#  }
#
#  set {
#    name  = "metrics-adapter.enabled"
#    value = "false"
#  }
#}
