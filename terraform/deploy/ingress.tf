resource "kubernetes_ingress" "app_ingress" {
  metadata {
    name   = local.app_name
    labels = {
      traefik = (var.environment == "staging" || var.environment == "production") ? "external" : "internal"
    }
  }

  spec {
    rule {
      host = local.app_domain

      http {
        path {
          path = "/"

          backend {
            service_name = local.app_name
            service_port = "http"
          }
        }
      }
    }
  }
}
