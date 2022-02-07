#!/bin/bash

set -e

# This script uses terraform to deploy a given image to Kubernetes

####################
# global variables #
####################

USAGE="Usage: $(basename $0) <environment>[-<instance>] <tag>"

NAME="$1"
TAG="$2"

#################
# sanity checks #
#################

if [[ $# -ne 2 ]]; then
  echo $USAGE; exit 1
fi

if [[ ${#TAG} -ne 7 ]]; then
  echo $USAGE; exit 1
fi

# Dynamic instances aren't allowed in production or staging
if [[ $NAME =~ ^(experimentation|testing)-([a-z0-9\-]+)$ ]]; then
  ENVIRONMENT="${BASH_REMATCH[1]}"
  INSTANCE="${BASH_REMATCH[2]}"

elif [[ $NAME =~ ^(experimentation|testing|staging|production)$ ]]; then
  ENVIRONMENT="${BASH_REMATCH[1]}"
  INSTANCE="primary"

else
  echo "Error: Invalid deployment name \"$NAME\""
  echo "The deployment name must be in the format:"
  echo "    <environment>"
  echo " or <environment>-<instance>"
  echo ""
  echo " e.g. staging, or testing-pr-123"
  exit 1

fi

############
# do stuff #
############

source "$(dirname "$0")/deploy-common.sh"

set -x

cd ./deploy/

$TERRAFORM_BINARY init
$TERRAFORM_BINARY workspace new "${TERRAFORM_WORKSPACE}" || true
$TERRAFORM_BINARY workspace select "${TERRAFORM_WORKSPACE}"
$TERRAFORM_BINARY init
$TERRAFORM_BINARY plan -var "environment=${ENVIRONMENT}" -var "instance=${INSTANCE}" -var "tag=${TAG}" -out="$PWD/deploy.plan"
$TERRAFORM_BINARY apply -auto-approve "$PWD/deploy.plan"
