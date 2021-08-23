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
      version = "1.11.1"
    }

    elasticsearch = {
      source  = "phillbaker/elasticsearch",
      version = "~> 1.5.2"
    }

    postgresql = {
      source  = "cyrilgdn/postgresql"
      version = "~> 1.11.2"
    }

    # random = {
    #   source  = "hashicorp/random"
    #   version = "3.0.1"
    # }
  }
}

provider "aws" {
  alias  = "common"
  region = "eu-west-1"
}

provider "aws" {
  region = "eu-west-1"

  assume_role {
    # role_arn = local.aws_role_arns[var.environment]
    role_arn = module.app_deploy.aws_role_arn
  }
}

provider "kubernetes" {
  host                   = module.app_deploy.kubernetes_host
  cluster_ca_certificate = module.app_deploy.kubernetes_certificate
  token                  = module.app_deploy.kubernetes_token
  # host                   = data.aws_eks_cluster.cluster.endpoint
  # cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
  # token                  = data.aws_eks_cluster_auth.cluster.token
  load_config_file = false
}

provider "postgresql" {
  host     = module.app_deploy.db_host
  port     = module.app_deploy.db_port
  database = module.app_deploy.db_name
  username = module.app_deploy.db_user
  password = module.app_deploy.db_password
  # host     = data.kubernetes_secret.environment_secret.data["db_host"]
  # port     = data.kubernetes_secret.environment_secret.data["db_port"]
  # database = data.kubernetes_secret.environment_secret.data["db_name"]
  # username = data.kubernetes_secret.environment_secret.data["db_user"]
  # password = data.kubernetes_secret.environment_secret.data["db_password"]
}

provider "elasticsearch" {
  url = module.app_deploy.es_url
  # url                 = "https://${data.kubernetes_secret.environment_secret.data["elasticsearch_endpoint"]}"
  sign_aws_requests   = true
  aws_region          = module.app_deploy.aws_region_name
  aws_assume_role_arn = module.app_deploy.aws_role_arn
  # aws_region          = data.aws_region.current.name
  # aws_assume_role_arn = local.aws_role_arns[var.environment]
  healthcheck = false
}

