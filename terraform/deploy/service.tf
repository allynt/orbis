resource "kubernetes_service" "app_service" {
  metadata {
    name   = local.app_name
    labels = local.app_labels
  }

  spec {
    type = "ClusterIP"

    selector = local.app_labels

    port {
      name        = "http"
      port        = 80
      target_port = 80
    }
  }
}
