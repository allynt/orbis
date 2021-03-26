resource "random_password" "redis_password" {
  length           = 16
  special          = true
  override_special = "_%@"
}

//
// Deployment
//

resource "kubernetes_deployment" "redis_server" {
  metadata {
    name   = local.redis_name
    labels = local.redis_labels
  }

  spec {
    replicas = 1

    strategy {
      type = "Recreate"
    }

    selector {
      match_labels = local.redis_labels
    }

    template {
      metadata {
        labels = local.redis_labels

        annotations = {}
      }

      spec {
        security_context {
          fs_group    = 1001
          run_as_user = 1001
        }

        container {
          name              = local.redis_name

          # For image docs see: https://gallery.ecr.aws/bitnami/redis
          image             = "public.ecr.aws/bitnami/redis:6.2"
          image_pull_policy = "Always"

          env {
            name = "REDIS_PASSWORD"
            value_from {
              secret_key_ref {
                name = local.deployment_secret_name
                key  = "redis_password"
              }
            }
          }

          env {
            name  = "ALLOW_EMPTY_PASSWORD"
            value = "no"
          }

          env {
            name  = "REDIS_AOF_ENABLED"
            value = "no"
          }

          env {
            name  = "REDIS_EXTRA_FLAGS"
            value = "--appendonly no --save \"\""
          }

          env {
            name  = "REDIS_DISABLE_COMMANDS"
            value = "FLUSHALL"
          }

          port {
            container_port = 6379
          }

          liveness_probe {
            initial_delay_seconds = 30
            period_seconds        = 10
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 5

            exec {
              command = [
                "redis-cli",
                "ping",
              ]
            }
          }

          readiness_probe {
            initial_delay_seconds = 30
            period_seconds        = 10
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 5

            exec {
              command = [
                "redis-cli",
                "ping",
              ]
            }
          }

          resources {
            limits {
              cpu    = "500m"
              memory = "256Mi"
            }

            requests {
              cpu    = "10m"
              memory = "64Mi"
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
resource "kubernetes_service" "redis_server" {
  metadata {
    name   = local.redis_name
    labels = local.redis_labels
  }

  spec {
    selector = local.redis_labels
    type     = "ClusterIP"

    port {
      name        = "redis"
      port        = 6379
      target_port = 6379
    }
  }
}
