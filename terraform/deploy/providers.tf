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
    random = {
      source = "hashicorp/random"
      version = "3.0.1"
    }
  }
}

//
// Providers
//

locals {
  aws_role_arns = {
    experimentation = "arn:aws:iam::244796486130:role/OrbisExperimentationAccountAccess"
    testing         = "arn:aws:iam::464205154305:role/OrbisTestingAccountAccess"
    staging         = "arn:aws:iam::304729679812:role/OrbisStagingAccountAccess"
    production      = "arn:aws:iam::987534643960:role/OrbisProductionAccountAccess"
  }
}

provider "aws" {
  alias   = "common"
  version = "~> 2.34"
  region  = "eu-west-1"
}

provider "aws" {
  version = "~> 2.34"
  region  = "eu-west-1"

  assume_role {
    role_arn = local.aws_role_arns[var.environment]
  }

}

provider "random" {
  # Configuration options
}

data "aws_eks_cluster" "cluster" {
  name = local.eks_cluster_name
}

data "aws_eks_cluster_auth" "cluster" {
  name = local.eks_cluster_name
}

provider "kubernetes" {
  version = "1.11.1"

  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.cluster.token
  load_config_file       = false
}

data "kubernetes_secret" "environment_secret" {
  metadata {
    name = local.app_environment_secret_name
  }
}

provider "postgresql" {
  host     = data.kubernetes_secret.environment_secret.data["db_host"]
  port     = data.kubernetes_secret.environment_secret.data["db_port"]
  database = data.kubernetes_secret.environment_secret.data["db_name"]
  username = data.kubernetes_secret.environment_secret.data["db_user"]
  password = data.kubernetes_secret.environment_secret.data["db_password"]
}
