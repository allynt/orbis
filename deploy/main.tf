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
  api_instance_hostname = (var.instance == "primary") ? "api" : "${var.instance}-api"
  app_instance_hostname = (var.instance == "primary") ? "app" : "${var.instance}-app"
}

module "app_deploy" {
  source = "git::https://github.com/astrosat/application-deployment-components.git//terraform/modules/application-deploy?ref=v1.0.6"

  providers = {
    aws.common = aws.common
  }

  environment = var.environment
  instance    = var.instance
  tag         = var.tag

  app = "orbis"

  api_domain = (var.environment == "production") ? "api.orbis.astrosat.net" : "${local.api_instance_hostname}.${var.environment}.orbis.astrosat.net"
  app_domain = (var.environment == "production") ? "app.orbis.astrosat.net" : "${local.app_instance_hostname}.${var.environment}.orbis.astrosat.net"

  api_image = "339570402237.dkr.ecr.eu-west-1.amazonaws.com/company/orbis/django:${var.tag}"
  app_image = "339570402237.dkr.ecr.eu-west-1.amazonaws.com/company/orbis/client:${var.tag}"

  has_client = true

  use_mapping   = true
  use_email     = true
  use_data      = true
  use_redis     = true
  use_tracking  = true
  use_geocoding = false
  use_logstash  = false
}
