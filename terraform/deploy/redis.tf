//
// Stateful Set
//
resource "kubernetes_stateful_set" "redis_server" {
  metadata {
    name   = "${local.app}-${var.environment}-${var.instance}-redis"
    labels = local.app_labels
  }

  spec {
    pod_management_policy = "Parallel"
    replicas              = 1

    selector {
      match_labels = local.app_labels
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
        name   = "${local.app}-redis-template"
        labels = local.app_labels

        annotations = {}
      }

      spec {
        # security_context {
        #   fs_group    = "${var.master_security_context["fs_group"]}"
        #   run_as_user = "${var.master_security_context["run_as_user"]}"
        # }

        # node_selector = "${var.kubernetes_node_selector}"

        container {
          name = "${local.app}-redis-container"
          # image             = var.redis_image
          image             = "docker.io/redis:6.0.10"
          image_pull_policy = "IfNotPresent"

          env {
            name  = "REDIS_REPLICATION_MODE"
            value = "master"
          }

          env {
            name  = "REDIS_PASSWORD"
            value = local.redis_password

            # value_from {
            #   secret_key_ref {
            #     name = local.redis_password
            #     key  = "redis_password"
            #   }
            # }
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

            # value = [
            #   "FLUSHDB",
            #   "FLUSHALL",
            # ]
          }

          env {
            name  = "REDIS_EXTRA_FLAGS"
            value = ""
          }

          port {
            name           = "${local.app}-redis"
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
              cpu    = "200m"
              memory = "1000Mi"
            }

            requests {
              cpu    = "200m"
              memory = "1000Mi"
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
    name   = local.app
    labels = local.app_labels
  }

  spec {
    selector   = local.app_labels
    type       = "ClusterIP"
    cluster_ip = "None"

    port {
      name        = "redis"
      port        = 6379
      target_port = 6379
    }
  }
}
