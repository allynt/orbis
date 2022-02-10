//
// Backend config
//
terraform {

  backend "s3" {
    bucket         = "astrosat-terraform-state"
    dynamodb_table = "astrosat-terraform-state-lock"
    key            = "deployment-state/orbis"
    region         = "eu-west-1"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 2.34"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.7"
    }

    postgresql = {
      source  = "cyrilgdn/postgresql"
      version = "~> 1.11.2"
    }
  }
}

provider "aws" {
  alias  = "common"
  region = "eu-west-1"
}

provider "aws" {
  region = "eu-west-1"

  assume_role {
    role_arn = module.app_deploy.aws_role_arn
  }
}

provider "kubernetes" {
  host                   = module.app_deploy.kubernetes_host
  cluster_ca_certificate = module.app_deploy.kubernetes_certificate
  token                  = module.app_deploy.kubernetes_token
}

provider "postgresql" {
  host     = module.app_deploy.db_host
  port     = module.app_deploy.db_port
  database = module.app_deploy.db_name
  username = module.app_deploy.db_user
  password = module.app_deploy.db_password
}
