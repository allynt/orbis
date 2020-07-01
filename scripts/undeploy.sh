#!/bin/bash

set -e

# This script un-deploys i.e. destroys an instance

####################
# global variables #
####################

USAGE="Usage: $(basename $0) <environment>-<instance>"

NAME="$1"

#################
# sanity checks #
#################

if [[ $# -ne 1 ]]; then
  echo $USAGE; exit 1
fi

# Can only undeploy dynamic instances
if [[ $NAME =~ ^(experimentation|testing)-([a-z0-9\-]+)$ ]]; then
  ENVIRONMENT="${BASH_REMATCH[1]}"
  INSTANCE="${BASH_REMATCH[2]}"

else
  echo "Error: Invalid deployment name \"$NAME\""
  echo "The deployment name must be in the format:"
  echo "   <environment>-<instance>"
  echo ""
  echo " e.g. staging, or testing-pr-123"
  exit 1

fi

if [[ "$INSTANCE" == "primary" ]]; then
  echo "Error: cannot undeploy the primary instance."
  exit 1
fi

############
# do stuff #
############

echo "ENVIRONMENT=$ENVIRONMENT"
echo "INSTANCE=$INSTANCE"

set -x

TERRAFORM_WORKSPACE="environment-${ENVIRONMENT}-${INSTANCE}"

cd ./terraform/deploy/

terraform init
terraform workspace select "${TERRAFORM_WORKSPACE}"
terraform init
terraform destroy -auto-approve -var "environment=${ENVIRONMENT}" -var "instance=${INSTANCE}" -var "tag=dummy"
terraform workspace select default
terraform workspace delete "${TERRAFORM_WORKSPACE}"
