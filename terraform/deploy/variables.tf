variable "environment" {
  description = "The name of the environment, e.g. testing, staging, production"
  type        = string
}

variable "tag" {
  description = "The tag of the docker image to deploy, usually a 7-letter git ref hash"
  type        = string
}

locals {
  app              = "orbis"
  eks_cluster_name = "astrosat-cluster"

  app_name   = "${local.app}-${var.environment}"
  app_domain = (var.environment == "production") ? "app.or3is.com" : "app.${var.environment}.or3is.com"
  app_image  = "339570402237.dkr.ecr.eu-west-1.amazonaws.com/company/orbis/django:${var.tag}"
  app_labels = {
    app         = local.app
    environment = var.environment
    deployment  = var.environment
  }

  # Deployment secrets are created by the deployment (this module)
  app_deployment_secret_name = "${local.app}-${var.environment}-deployment-secrets"

  # Environment secrets are created by the infrastructure module, and used by this module
  app_environment_secret_name = "${local.app}-${var.environment}-environment-secrets"

  is_production = (var.environment == "staging" || var.environment == "production")
  num_replicas  = local.is_production ? 3 : 2

  healthcheck_path = "/healthcheck/"

  # Other Services
  staticdata_url             = (var.environment == "production") ? "https://staticdata.astrosat.net/" : "https://staticdata.${var.environment}.astrosat.net/"
  data_sources_directory_url = (var.environment == "production") ? "https://data-sources-directory.astrosat.net/" : "https://data-sources-directory.${var.environment}.astrosat.net/"
}
