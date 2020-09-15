//
// Deployment
//

resource "kubernetes_deployment" "app_deployment" {
  depends_on = [
    kubernetes_secret.deployment_secret
  ]

  metadata {
    name   = local.app_name
    labels = local.app_labels

    annotations = {
      "linkerd.io/inject" = "enabled"
    }
  }

  timeouts {
    create = "30m"
    delete = "30m"
  }

  spec {
    progress_deadline_seconds = 60 * 15 // 15 minutes

    selector {
      match_labels = local.app_labels
    }

    replicas = local.num_replicas

    template {
      metadata {
        labels = local.app_labels

        annotations = {
          "linkerd.io/inject" = "enabled"
        }
      }

      spec {

        automount_service_account_token = true

        container {
          name  = local.app_name
          image = local.app_image

          port {
            container_port = 80
          }

          // Readiness probe detects when the app is ready to recieve traffic (i.e. after startup)
          readiness_probe {
            initial_delay_seconds = 10
            period_seconds        = 10

            http_get {
              path = local.healthcheck_app_path
              port = 80
            }
          }

          // Liveness probe restarts the container if health checks fail for a long time
          liveness_probe {
            initial_delay_seconds = 900
            period_seconds        = 60
            failure_threshold     = 15

            http_get {
              path = local.healthcheck_app_path
              port = 80
            }
          }

          // Environment Variables
          env {
            name  = "SYS_ENV"
            value = "deployment"
          }

          // Host of back-end API
          env {
            name = "REACT_APP_API_HOST"
            value = "https://${local.api_domain}"
          }

        }
      }
    }
  }
}

//
// Service
//

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

//
// Ingress
//

resource "kubernetes_ingress" "app_ingress" {
  metadata {
    name = local.app_name
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
