data "aws_secretsmanager_secret_version" "deployment_secret" {
  provider  = aws.common
  secret_id = "${var.environment}/${local.app}/secrets"
}

locals {
  deployment_secrets = jsondecode(data.aws_secretsmanager_secret_version.deployment_secret.secret_string)
}

resource "kubernetes_secret" "deployment_secret" {
  metadata {
    name = local.app_deployment_secret_name
  }

  data = local.deployment_secrets
}
