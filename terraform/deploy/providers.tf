//
// Backend config
//

terraform {

  required_version = ">= 1.0"

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

    postgresql = {
      source  = "cyrilgdn/postgresql"
      version = "~> 1.11.2"
    }

    random = {
      source  = "hashicorp/random"
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

// AWS

provider "aws" {
  alias  = "common"
  region = "eu-west-1"
}

provider "aws" {
  region = "eu-west-1"

  assume_role {
    role_arn = local.aws_role_arns[var.environment]
  }

}

// Kubernetes

data "aws_eks_cluster" "cluster" {
  name = local.eks_cluster_name
}

data "aws_eks_cluster_auth" "cluster" {
  name = local.eks_cluster_name
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.cluster.token
  load_config_file       = false
}

// Postgres

data "kubernetes_secret" "environment_secret" {
  metadata {
    name = local.environment_secret_name
  }
}

locals {
  env_secrets = data.kubernetes_secret.environment_secret.data
}

provider "postgresql" {
  host     = local.env_secrets["db_host"]
  port     = local.env_secrets["db_port"]
  database = local.env_secrets["db_name"]
  username = local.env_secrets["db_user"]
  password = local.env_secrets["db_password"]
}

// Random

provider "random" {
  # Configuration options
}
