//
// Backend config
//

terraform {
  backend "s3" {
    bucket         = "astrosat-terraform-state"
    dynamodb_table = "astrosat-terraform-state-lock"
    key            = "deployment-state/testing/orbis"
    region         = "eu-west-1"
  }
}

//
// Providers
//

provider "aws" {
  alias   = "common"
  version = "~> 2.34"
  region  = "eu-west-1"
}

provider "aws" {
  version = "~> 2.34"
  region  = "eu-west-1"

  assume_role {
    role_arn = local.aws_role_arn
  }

}

data "aws_eks_cluster" "cluster" {
  name = local.eks_cluster_name
}

data "aws_eks_cluster_auth" "cluster" {
  name = local.eks_cluster_name
}

provider "kubernetes" {
  version = "1.10"

  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.cluster.token
  load_config_file       = false
}

data "aws_secretsmanager_secret_version" "app_secrets" {
  provider  = aws.common
  secret_id = "${local.environment}/${local.app}/secrets"
}

locals {
  app_secrets = jsondecode(data.aws_secretsmanager_secret_version.app_secrets.secret_string)
  app_branch_db_name = "${local.app_secrets["db_name"]}_${var.app_environment}"
}

## Temporary change to fix lack of working self-hosted runners
#provider "postgresql" {
#  host     = local.app_secrets["db_host"]
#  port     = local.app_secrets["db_port"]
#  database = local.app_secrets["db_name"]
#  username = local.app_secrets["db_user"]
#  password = local.app_secrets["db_password"]
#}
