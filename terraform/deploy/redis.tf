resource "random_password" "password" {
  length           = 16
  special          = true
  override_special = "_%@"
}

//
// Stateful Set
//
resource "kubernetes_stateful_set" "redis_server" {
  metadata {
    name   = local.redis_name
    labels = local.redis_labels
  }

  spec {
    pod_management_policy = "Parallel"
    replicas              = 1

    selector {
      match_labels = local.redis_labels
    }

    service_name = "${local.app}-redis"

    update_strategy {
      type = "RollingUpdate"

      rolling_update {
        partition = 1
      }
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
          image             = "docker.io/redis:6.0.10"
          image_pull_policy = "IfNotPresent"

          env {
            name  = "REDIS_REPLICATION_MODE"
            value = "master"
          }

          env {
            name = "REDIS_PASSWORD"
            value_from {
              secret_key_ref {
                name = local.app_deployment_secret_name
                key  = "redis_password"
              }
            }
          }

          env {
            name  = "ALLOW_EMPTY_PASSWORD"
            value = "no"
          }

          env {
            name  = "REDIS_PORT"
            value = 6379
          }

          env {
            name  = "REDIS_DISABLE_COMMANDS"
            value = "FLUSHALL"
          }

          env {
            name  = "REDIS_EXTRA_FLAGS"
            value = ""
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
