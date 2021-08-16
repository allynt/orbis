//
// Task Worker Deployment
//

resource "kubernetes_deployment" "worker" {

  depends_on = [
    kubernetes_secret.deployment_secret
  ]

  metadata {
    name   = local.worker_name
    labels = local.worker_labels
  }

  spec {
    selector {
      match_labels = local.worker_labels
    }

    // WARNING
    //  Before increasing replicas beyond 1
    //  it is neccessary to split out the celery worker and celery scheduler
    //  as only one scheduler can be run at a time.
    replicas = 1
    // WARNING

    template {
      metadata {
        labels = local.worker_labels
      }

      spec {

        automount_service_account_token = true

        container {
          name  = local.worker_name
          image = local.api_image # the celery resource uses the api image

          // Environment Variables
          env {
            name  = "SYS_ENV"
            value = "deployment"
          }

          env {
            name  = "ENABLE_CELERY"
            value = 1
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
                name = local.deployment_secret_name
                key  = "secret_key"
              }
            }
          }

          env {
            // This is required to allow running manual celery commands
            //  and the healthchecks.
            name  = "DJANGO_SETTINGS_MODULE"
            value = "core.settings"
          }

          env {
            name  = "DJANGO_SITE_DOMAIN"
            value = local.app_domain
          }

          env {
            name  = "DJANGO_APP"
            value = local.app
          }

          env {
            name  = "DJANGO_INSTANCE"
            value = var.instance
          }

          env {
            name  = "DJANGO_ENVIRONMENT"
            value = var.environment
          }


          // Media Bucket/AWS Parameters
          env {
            name = "DJANGO_MEDIA_BUCKET"
            value_from {
              secret_key_ref {
                name = local.environment_secret_name
                key  = "media_bucket"
              }
            }
          }

          env {
            name = "DJANGO_AWS_ACCESS_KEY_ID"
            value_from {
              secret_key_ref {
                name = local.environment_secret_name
                key  = "aws_access_key_id"
              }
            }
          }

          env {
            name = "DJANGO_AWS_SECRET_ACCESS_KEY"
            value_from {
              secret_key_ref {
                name = local.environment_secret_name
                key  = "aws_secret_access_key"
              }
            }
          }


          // Database Parameters
          env {
            name = "DJANGO_DB_HOST"
            value_from {
              secret_key_ref {
                name = local.environment_secret_name
                key  = "db_host"
              }
            }
          }

          env {
            name = "DJANGO_DB_PORT"
            value_from {
              secret_key_ref {
                name = local.environment_secret_name
                key  = "db_port"
              }
            }
          }

          env {
            name  = "DJANGO_DB_NAME"
            value = local.instance_db_name
          }

          env {
            name = "DJANGO_DB_USER"
            value_from {
              secret_key_ref {
                name = local.environment_secret_name
                key  = "db_user"
              }
            }
          }

          env {
            name = "DJANGO_DB_PASSWORD"
            value_from {
              secret_key_ref {
                name = local.environment_secret_name
                key  = "db_password"
              }
            }
          }

          // Email Parameters
          env {
            name = "DJANGO_EMAIL_HOST"
            value_from {
              secret_key_ref {
                name = local.environment_secret_name
                key  = "mail_smtp_endpoint"
              }
            }
          }

          env {
            name = "DJANGO_EMAIL_PORT"
            value_from {
              secret_key_ref {
                name = local.environment_secret_name
                key  = "mail_smtp_port"
              }
            }
          }

          env {
            name = "DJANGO_EMAIL_USER"
            value_from {
              secret_key_ref {
                name = local.environment_secret_name
                key  = "mail_smtp_user"
              }
            }
          }

          env {
            name = "DJANGO_EMAIL_PASSWORD"
            value_from {
              secret_key_ref {
                name = local.environment_secret_name
                key  = "mail_smtp_password"
              }
            }
          }

          env {
            name = "DJANGO_EMAIL_DOMAIN"
            value_from {
              secret_key_ref {
                name = local.environment_secret_name
                key  = "mail_domain"
              }
            }
          }

          // Logstash for App Analytics

          env {
            name = "DJANGO_LOGSTASH_ENDPOINT"
            value_from {
              secret_key_ref {
                name = local.environment_secret_name
                key  = "logstash_service"
              }
            }
          }

          // Celery Broker Config

          env {
            name  = "DJANGO_CELERY_BROKER_PROTOCOL"
            value = "redis"
          }

          env {
            name  = "DJANGO_CELERY_BROKER_HOST"
            value = kubernetes_service.redis_server.metadata.0.name
          }

          env {
            name  = "DJANGO_CELERY_BROKER_PORT"
            value = "6379"
          }

          env {
            name = "DJANGO_CELERY_BROKER_REDIS_PASSWORD"
            value_from {
              secret_key_ref {
                name = local.deployment_secret_name
                key  = "redis_password"
              }
            }
          }


          // Other Services

          env {
            name = "DJANGO_MAPBOX_TOKEN"
            value_from {
              secret_key_ref {
                name = local.deployment_secret_name
                key  = "mapbox_token"
              }
            }
          }

          env {
            name = "DJANGO_TRACKING_ID"
            value_from {
              secret_key_ref {
                name = local.deployment_secret_name
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
                name = local.environment_secret_name
                key  = "data_token_secret"
              }
            }
          }

          env {
            name = "DJANGO_COPERNICUS_USERNAME"
            value_from {
              secret_key_ref {
                name = local.deployment_secret_name
                key  = "copernicus_username"
              }
            }
          }

          env {
            name = "DJANGO_COPERNICUS_PASSWORD"
            value_from {
              secret_key_ref {
                name = local.deployment_secret_name
                key  = "copernicus_password"
              }
            }
          }

          env {
            name = "DJANGO_OLSP_URL"
            value_from {
              secret_key_ref {
                name = local.deployment_secret_name
                key  = "olsp_url"
              }
            }
          }

          env {
            name = "DJANGO_MAPBOX_STYLES"
            value_from {
              secret_key_ref {
                name = local.deployment_secret_name
                key  = "mapbox_styles"
              }
            }
          }

          env {
            name  = "DJANGO_CLIENT_HOST"
            value = "https://${local.app_domain}"
          }

          // Healthcheck Probes
          liveness_probe {
            initial_delay_seconds = 30
            period_seconds        = 600
            timeout_seconds       = 15
            success_threshold     = 1
            failure_threshold     = 2

            exec {
              command = local.healthcheck_worker_command
            }
          }

          readiness_probe {
            initial_delay_seconds = 30
            period_seconds        = 30
            timeout_seconds       = 15
            success_threshold     = 1
            failure_threshold     = 4

            exec {
              command = local.healthcheck_worker_command
            }
          }

        }

      }

    }

  }

}
