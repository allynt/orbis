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

source "$(dirname "$0")/deploy-common.sh"

set -x

cd ./terraform/deploy/

$TERRAFORM_BINARY init
$TERRAFORM_BINARY workspace select "${TERRAFORM_WORKSPACE}"
$TERRAFORM_BINARY init
$TERRAFORM_BINARY destroy -auto-approve -var "environment=${ENVIRONMENT}" -var "instance=${INSTANCE}" -var "tag=dummy"
$TERRAFORM_BINARY workspace select default
$TERRAFORM_BINARY workspace delete "${TERRAFORM_WORKSPACE}"
