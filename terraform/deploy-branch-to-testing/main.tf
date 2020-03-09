//
// Variables
//

variable "app_environment" {
  description = "The name of the app environment to deploy to"
  type        = string
}

variable "tag" {
  description = "The tag of the docker image to deploy"
  type        = string
}

variable "aws_cli_profile" {
  description = "The name of the aws cli profile to use to generate eks auth tokens."
  type        = string
}

locals {
  app         = "orbis"
  environment = "testing"

  eks_cluster_name = "orbis-platform-${local.environment}"
  aws_cli_profile  = var.aws_cli_profile
  aws_role_arn     = "arn:aws:iam::464205154305:role/OrbisTestingAccountAccess"

  app_name       = "${local.app}-${var.app_environment}"
  app_domain     = "app-${var.app_environment}.testing.or3is.com"
  app_image      = "339570402237.dkr.ecr.eu-west-1.amazonaws.com/company/orbis/django:${var.tag}"
  app_secret     = "${local.app}-${var.app_environment}-secret"
  app_aws_secret = "${local.app}-${local.environment}-aws-secret"
  app_labels = {
    app             = local.app
    environment     = local.environment
    app_environment = var.app_environment
  }

  app_env_secrets = [
    {
      var = "DJANGO_DEBUG"
      key = "debug"
    },
    {
      var = "DJANGO_SECRET_KEY"
      key = "secret_key"
    },
    {
      var = "DJANGO_DB_HOST"
      key = "db_host"
    },
    {
      var = "DJANGO_DB_PORT"
      key = "db_port"
    },
    // DJANGO_DB_NAME is per-branch and defined in the deployment resource
    {
      var = "DJANGO_DB_USER"
      key = "db_user"
    },
    {
      var = "DJANGO_DB_PASSWORD"
      key = "db_password"
    },
    {
      var = "DJANGO_EMAIL_HOST"
      key = "email_host"
    },
    {
      var = "DJANGO_EMAIL_PORT"
      key = "email_port"
    },
    {
      var = "DJANGO_EMAIL_USER"
      key = "email_user"
    },
    {
      var = "DJANGO_EMAIL_PASSWORD"
      key = "email_password"
    },
    {
      var = "DJANGO_MAPBOX_TOKEN"
      key = "mapbox_token"
    },
    {
      var = "DJANGO_TRACKING_ID"
      key = "tracking_id"
    },
    {
      var = "DJANGO_DATA_URL"
      key = "static_data_url"
    },
    {
      var = "DJANGO_COPERNICUS_USERNAME"
      key = "copernicus_username"
    },
    {
      var = "DJANGO_COPERNICUS_PASSWORD"
      key = "copernicus_password"
    },
    {
      var = "DJANGO_OLSP_URL"
      key = "olsp_url"
    }
  ]
}

//
// Resources
//

resource "postgresql_database" "branch_db" {
  count = (var.app_environment == "testing-master") ? 0 : 1

  lifecycle {
    ignore_changes = [
      lc_collate,
      lc_ctype
    ]
  }

  name       = local.app_branch_db_name
  owner      = local.app_secrets["db_user"]
  template   = local.app_secrets["db_name"]
  lc_ctype   = "DEFAULT"
  lc_collate = "DEFAULT"
}

resource "kubernetes_secret" "app_secret" {
  metadata {
    name = local.app_secret
  }

  data = local.app_secrets
}

resource "kubernetes_deployment" "app_deployment" {
  depends_on = [
    kubernetes_secret.app_secret
  ]

  timeouts {
    create = "60m"
    delete = "60m"
  }

  metadata {
    name   = local.app_name
    labels = local.app_labels
  }

  spec {
    selector {
      match_labels = local.app_labels
    }

    replicas = 1

    template {
      metadata {
        labels = local.app_labels
      }

      spec {
        container {
          name  = local.app_name
          image = local.app_image

          port {
            container_port = 8000
          }

          readiness_probe {
            initial_delay_seconds = 10
            period_seconds        = 10

            http_get {
              path = "/healthcheck/"
              port = 80
            }
          }

          liveness_probe {
            initial_delay_seconds = 900
            period_seconds        = 60
            failure_threshold     = 15

            http_get {
              path = "/healthcheck/"
              port = 80
            }
          }

          env {
            name  = "SYS_ENV"
            value = "deployment"
          }

          env {
            name  = "DJANGO_SITE_DOMAIN"
            value = local.app_domain
          }

          env {
            name  = "DJANGO_DB_NAME"
            value = (var.app_environment == "testing-master") ? local.app_secrets["db_name"] : local.app_branch_db_name
          }

          env {
            name = "DJANGO_MEDIA_BUCKET"
            value_from {
              secret_key_ref {
                name = local.app_aws_secret
                key  = "media_bucket"
              }
            }
          }

          env {
            name = "DJANGO_AWS_ACCESS_KEY_ID"
            value_from {
              secret_key_ref {
                name = local.app_aws_secret
                key  = "aws_access_key_id"
              }
            }
          }

          env {
            name = "DJANGO_AWS_SECRET_ACCESS_KEY"
            value_from {
              secret_key_ref {
                name = local.app_aws_secret
                key  = "aws_secret_access_key"
              }
            }
          }

          env {
            name = "DJANGO_DATA_TOKEN_SECRET"
            value_from {
              secret_key_ref {
                name = local.app_aws_secret
                key  = "data_token_secret"
              }
            }
          }

          // Loop over the env var secrets
          dynamic "env" {
            for_each = local.app_env_secrets

            content {
              name = env.value.var
              value_from {
                secret_key_ref {
                  name = local.app_secret
                  key  = env.value.key
                }
              }
            }
          }

        }
      }
    }
  }
}


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

resource "kubernetes_ingress" "app_ingress" {
  metadata {
    name = local.app_name
    labels = {
      traefik = "external"
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