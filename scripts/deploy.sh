#!/bin/bash

# This script uses terraform to create the deployment

####################
# global variables #
####################

USAGE="Usage: $(basename $0) <environment> <tag>"

ENVIRONMENT="$1"
TAG="$2"

#################
# sanity checks #
#################

if [[ $# -ne 2 ]]; then
  echo $USAGE; exit 1
fi

if [ "$ENVIRONMENT" != "experimentation" ] && [ "$ENVIRONMENT" != "testing" ] && [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo "Error: ENVIRONMENT must be one of experimentation, testing, staging or production."
    exit 1
fi

if [[ ${#TAG} -ne 7 ]]; then
  echo $USAGE; exit 1
fi

############
# do stuff #
############

TERRAFORM_WORKSPACE="environment-${ENVIRONMENT}"

cd ./terraform/deploy/

terraform init
terraform workspace new "${TERRAFORM_WORKSPACE}" || true
terraform workspace select "${TERRAFORM_WORKSPACE}"
terraform init
terraform plan -var "environment=${ENVIRONMENT}" -var "tag=${TAG}" -out="$PWD/deploy.plan"
terraform apply -auto-approve "$PWD/deploy.plan"
