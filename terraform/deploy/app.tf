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
  }

  timeouts {
    create = "30m"
    delete = "30m"
  }

  spec {
    progress_deadline_seconds = 60 * 10 // 10 minutes

    selector {
      match_labels = local.app_labels
    }

    replicas = local.num_replicas

    template {
      metadata {
        labels = local.app_labels
      }

      spec {
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
              path = local.healthcheck_path
              port = 80
            }
          }

          // Liveness probe restarts the container if health checks fail for a long time
          liveness_probe {
            initial_delay_seconds = 900
            period_seconds        = 60
            failure_threshold     = 15

            http_get {
              path = local.healthcheck_path
              port = 80
            }
          }

          // Environment Variables
          env {
            name  = "SYS_ENV"
            value = "deployment"
          }

          env {
            name  = "DJANGO_SITE_DOMAIN"
            value = local.app_domain
          }

          // Media Bucket/AWS Parameters
          env {
            name = "DJANGO_MEDIA_BUCKET"
            value_from {
              secret_key_ref {
                name = local.app_environment_secret_name
                key  = "media_bucket"
              }
            }
          }

          env {
            name = "DJANGO_AWS_ACCESS_KEY_ID"
            value_from {
              secret_key_ref {
                name = local.app_environment_secret_name
                key  = "aws_access_key_id"
              }
            }
          }

          env {
            name = "DJANGO_AWS_SECRET_ACCESS_KEY"
            value_from {
              secret_key_ref {
                name = local.app_environment_secret_name
                key  = "aws_secret_access_key"
              }
            }
          }

          // Django Parameters
          env {
            name  = "DJANGO_DEBUG"
            value = local.is_production ? false : true
          }

          env {
            name = "DJANGO_SECRET_KEY"
            value_from {
              secret_key_ref {
                name = local.app_deployment_secret_name
                key  = "secret_key"
              }
            }
          }

          // Database Parameters
          env {
            name = "DJANGO_DB_HOST"
            value_from {
              secret_key_ref {
                name = local.app_environment_secret_name
                key  = "db_host"
              }
            }
          }

          env {
            name = "DJANGO_DB_PORT"
            value_from {
              secret_key_ref {
                name = local.app_environment_secret_name
                key  = "db_port"
              }
            }
          }

          env {
            name = "DJANGO_DB_NAME"
            value_from {
              secret_key_ref {
                name = local.app_environment_secret_name
                key  = "db_name"
              }
            }
          }

          env {
            name = "DJANGO_DB_USER"
            value_from {
              secret_key_ref {
                name = local.app_environment_secret_name
                key  = "db_user"
              }
            }
          }

          env {
            name = "DJANGO_DB_PASSWORD"
            value_from {
              secret_key_ref {
                name = local.app_environment_secret_name
                key  = "db_password"
              }
            }
          }

          // Email Parameters
          env {
            name = "DJANGO_EMAIL_HOST"
            value_from {
              secret_key_ref {
                name = local.app_deployment_secret_name
                key  = "email_host"
              }
            }
          }

          env {
            name = "DJANGO_EMAIL_PORT"
            value_from {
              secret_key_ref {
                name = local.app_deployment_secret_name
                key  = "email_port"
              }
            }
          }

          env {
            name = "DJANGO_EMAIL_USER"
            value_from {
              secret_key_ref {
                name = local.app_deployment_secret_name
                key  = "email_user"
              }
            }
          }

          env {
            name = "DJANGO_EMAIL_PASSWORD"
            value_from {
              secret_key_ref {
                name = local.app_deployment_secret_name
                key  = "email_password"
              }
            }
          }

          // Other Services
          env {
            name = "DJANGO_MAPBOX_TOKEN"
            value_from {
              secret_key_ref {
                name = local.app_deployment_secret_name
                key  = "mapbox_token"
              }
            }
          }

          env {
            name = "DJANGO_TRACKING_ID"
            value_from {
              secret_key_ref {
                name = local.app_deployment_secret_name
                key  = "tracking_id"
              }
            }
          }

          env {
            name  = "DJANGO_DATA_SOURCES_DIRECTORY_URL"
            value = local.data_sources_directory_url
          }

          env {
            name = "DJANGO_DATA_TOKEN_SECRET"
            value_from {
              secret_key_ref {
                name = local.app_environment_secret_name
                key  = "data_token_secret"
              }
            }
          }

          env {
            name = "DJANGO_COPERNICUS_USERNAME"
            value_from {
              secret_key_ref {
                name = local.app_deployment_secret_name
                key  = "copernicus_username"
              }
            }
          }

          env {
            name = "DJANGO_COPERNICUS_PASSWORD"
            value_from {
              secret_key_ref {
                name = local.app_deployment_secret_name
                key  = "copernicus_password"
              }
            }
          }

          env {
            name = "DJANGO_OLSP_URL"
            value_from {
              secret_key_ref {
                name = local.app_deployment_secret_name
                key  = "olsp_url"
              }
            }
          }

          env {
            name = "DJANGO_MAPBOX_STYLES"
            value_from {
              secret_key_ref {
                name = local.app_deployment_secret_name
                key  = "mapbox_styles"
              }
            }
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
