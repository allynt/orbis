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

  //
  // Base Config
  //

  app              = "orbis"
  eks_cluster_name = "astrosat-cluster"

  is_production = (var.environment == "staging" || var.environment == "production")
  num_replicas  = local.is_production ? 2 : 1

  //
  // Component Config
  //

  instance_db_name = (var.instance == "primary") ? data.kubernetes_secret.environment_secret.data["db_name"] : "${data.kubernetes_secret.environment_secret.data["db_name"]}-${var.instance}"

  healthcheck_api_path = "/healthcheck/"
  healthcheck_app_path = "/env-config.js"
  healthcheck_worker_command = [
    "/bin/bash", "-c",
    "cd /home/app/server && pipenv run celery --app tasks inspect ping -d celery@worker.$HOSTNAME"
  ]

  //
  // Component Images
  //

  api_image  = "339570402237.dkr.ecr.eu-west-1.amazonaws.com/company/orbis/django:${var.tag}"
  app_image  = "339570402237.dkr.ecr.eu-west-1.amazonaws.com/company/orbis/client:${var.tag}"

  //
  // Component Hostnames
  //

  api_instance_hostname = (var.instance == "primary") ? "api" : "${var.instance}-api"
  app_instance_hostname = (var.instance == "primary") ? "app" : "${var.instance}-app"

  api_domain = (var.environment == "production") ? "api.orbis.astrosat.net" : "${local.api_instance_hostname}.${var.environment}.orbis.astrosat.net"
  app_domain = (var.environment == "production") ? "app.orbis.astrosat.net" : "${local.app_instance_hostname}.${var.environment}.orbis.astrosat.net"


  //
  // Component Resource Identifiers
  //

  api_name       = "${local.app}-api-${var.environment}-${var.instance}"
  app_name       = "${local.app}-app-${var.environment}-${var.instance}"
  redis_name     = "${local.app}-redis-${var.environment}-${var.instance}"
  worker_name    = "${local.app}-worker-${var.environment}-${var.instance}"
  scheduler_name = "${local.app}-scheduler-${var.environment}-${var.instance}"

  base_labels = {
    app         = local.app
    environment = var.environment
    instance    = var.instance
  }

  api_labels       = merge(local.base_labels, { role = "server" })
  app_labels       = merge(local.base_labels, { role = "client" })
  redis_labels     = merge(local.base_labels, { role = "redis" })
  worker_labels    = merge(local.base_labels, { role = "worker" })
  scheduler_labels = merge(local.base_labels, { role = "scheduler" })

  //
  // Secrets
  //

  // Deployment secrets are created by the deployment (this module)
  deployment_secret_name = "${local.app}-${var.environment}-${var.instance}-deployment-secrets"

  // Environment secrets are created by the infrastructure module, and used by this module
  environment_secret_name = "${local.app}-${var.environment}-environment-secrets"

  //
  // Other Services
  //

  // staticdata URL is the external URL used by the frontend
  staticdata_url = (var.environment == "production") ? "https://staticdata.astrosat.net/" : "https://staticdata.${var.environment}.astrosat.net/"

  // data directory URL is the internal URL used by the backend
  // this is the internal hostname for direct communication between services within the kubernetes cluster
  data_sources_directory_url = "http://data-sources-directory-${var.environment}.primary.default.svc.cluster.local/"

  // data index URL is the external URL used by the backend
  data_index_url = (var.environment == "production") ? "https://api.ireland.data-index-service.astrosat.net/v1/" : "https://api.${var.environment}.ireland.data-index-service.astrosat.net/v1/"
}
