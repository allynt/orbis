locals {
  app = "orbis"

  environment = get_env("ENVIRONMENT")
  instance    = get_env("INSTANCE")

  api_instance_hostname = (local.instance == "primary") ? "api" : "${local.instance}-api"
  app_instance_hostname = (local.instance == "primary") ? "app" : "${local.instance}-app"
}

terraform {
  source = "git::https://github.com/astrosat/application-deployment-components.git//terraform/components/application-deploy?ref=v1.1.4"
}

remote_state {
  backend = "s3"

  config = {
    bucket         = "astrosat-terraform-state"
    dynamodb_table = "astrosat-terraform-state-lock"
    key            = "deployment-state/${local.app}"
    region         = "eu-west-1"
    encrypt        = true
  }

  generate = {
    path      = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
}

inputs = {
  app         = local.app
  environment = local.environment
  instance    = local.instance

  api_domain = (local.environment == "production") ? "api.orbis.astrosat.net" : "${local.api_instance_hostname}.${local.environment}.orbis.astrosat.net"
  app_domain = (local.environment == "production") ? "app.orbis.astrosat.net" : "${local.app_instance_hostname}.${local.environment}.orbis.astrosat.net"

  has_client = true

  use_mapping   = true
  use_email     = true
  use_data      = true
  use_redis     = true
  use_tracking  = true
  use_geocoding = false
  use_logstash  = false
}
