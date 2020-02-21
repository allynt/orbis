#!/bin/bash

# This script uses terraform to create the deployment

####################
# global variables #
####################

USAGE="Usage: $(basename $0) <environment> <tag>"

ENVIRONMENT=$1
TAG=$2

#################
# sanity checks #
#################

if [[ $# -ne 2 ]]; then
  echo $USAGE; exit 1
fi

if [[ ${#TAG} -ne 7 ]]; then
  echo $USAGE; exit 1
fi

# TODO: SHOULD WE CHECK THE ENVIRONMENT AGAINST A KNOWN LIST?

############
# do stuff #
############

ENVIRONMENT_TYPE=$(echo ${ENVIRONMENT} | cut -d '-' -f1)

TERRAFORM_WORKSPACE="environment-${ENVIRONMENT}"

if [[ "${ENVIRONMENT_TYPE}" == "testing" ]]; then
  cd ./terraform/deploy-branch-to-testing
  PLAN_ARGS="-var app_environment=${ENVIRONMENT} -var tag=${TAG} -var aws_cli_profile=${ENVIRONMENT_TYPE} -out=deploy.plan"
else
  cd ./terraform/deploy-to-production
  PLAN_ARGS="-var environment=${ENVIRONMENT} -var tag=${TAG} -out=deploy.plan"
fi

terraform init
terraform workspace new "${TERRAFORM_WORKSPACE}" || true
terraform workspace select "${TERRAFORM_WORKSPACE}"
terraform plan ${PLAN_ARGS}
terraform apply -auto-approve ./deploy.plan
