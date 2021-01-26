variable "environment" {
  description = "The name of the environment, e.g. testing, staging, production"
  type        = string
}

variable "instance" {
  description = "The name of the instance e.g. 'primary' or 'pr-123'"
  type        = string
}

variable "tag" {
  description = "The tag of the docker image to deploy, usually a 7-letter git ref hash"
  type        = string
}

locals {
  app              = "orbis"
  eks_cluster_name = "astrosat-cluster"

  api_instance_hostname = (var.instance == "primary") ? "api" : "${var.instance}-api"
  app_instance_hostname = (var.instance == "primary") ? "app" : "${var.instance}-app"

  app_instance_db_name  = (var.instance == "primary") ? data.kubernetes_secret.environment_secret.data["db_name"] : "${data.kubernetes_secret.environment_secret.data["db_name"]}-${var.instance}"

  api_name   = "${local.app}-api-${var.environment}-${var.instance}"
  app_name   = "${local.app}-app-${var.environment}-${var.instance}"

  api_domain = (var.environment == "production") ? "api.orbis.astrosat.net" : "${local.api_instance_hostname}.${var.environment}.orbis.astrosat.net"
  api_image  = "339570402237.dkr.ecr.eu-west-1.amazonaws.com/company/orbis/django:${var.tag}"

  app_domain = (var.environment == "production") ? "app.orbis.astrosat.net" : "${local.app_instance_hostname}.${var.environment}.orbis.astrosat.net"
  app_image  = "339570402237.dkr.ecr.eu-west-1.amazonaws.com/company/orbis/client:${var.tag}"

  api_labels = {
    app         = local.app
    environment = var.environment
    instance    = var.instance
    role        = "server"
  }

  app_labels = {
    app         = local.app
    environment = var.environment
    instance    = var.instance
    role        = "client"
  }

  # Deployment secrets are created by the deployment (this module)
  app_deployment_secret_name = "${local.app}-${var.environment}-${var.instance}-deployment-secrets"

  # Environment secrets are created by the infrastructure module, and used by this module
  app_environment_secret_name = "${local.app}-${var.environment}-environment-secrets"

  is_production = (var.environment == "staging" || var.environment == "production")
  num_replicas  = local.is_production ? 3 : ((var.instance == "primary") ? 2 : 1)

  healthcheck_api_path = "/healthcheck/"
  healthcheck_app_path = "/env-config.js"

  # Other Services
  # staticdata URL is the external URL used by the frontend
  staticdata_url             = (var.environment == "production") ? "https://staticdata.astrosat.net/" : "https://staticdata.${var.environment}.astrosat.net/"
  # data directory URL is the internal URL used by the backend
  # this is the internal hostname for direct communication between services within the kubernetes cluster
  data_sources_directory_url = "http://data-sources-directory-${var.environment}.default.svc.cluster.local/"

  redis_password = "myredispassword"
}
