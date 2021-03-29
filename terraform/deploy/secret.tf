data "aws_secretsmanager_secret_version" "deployment_secret" {
  provider  = aws.common
  secret_id = "${var.environment}/${local.app}/secrets"
}

locals {
  deployment_secrets = merge(jsondecode(data.aws_secretsmanager_secret_version.deployment_secret.secret_string), {
    redis_password = random_password.redis_password.result
  })
}

resource "kubernetes_secret" "deployment_secret" {
  metadata {
    name = local.deployment_secret_name
  }

  data = local.deployment_secrets
}
