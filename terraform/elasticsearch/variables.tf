variable "environment" {
  description = "The name of the environment, e.g. testing, staging, production"
  type        = string
}

variable "instance" {
  description = "The name of the instance e.g. 'primary' or 'pr-123'"
  type        = string
}

locals {
  app              = "orbis"
  eks_cluster_name = "astrosat-cluster"
  // Environment secrets are created by the infrastructure module, and used by this module
  environment_secret_name = "${local.app}-${var.environment}-environment-secrets"
}
