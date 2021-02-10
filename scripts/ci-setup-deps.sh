#!/bin/bash

# This script is meant to be run by the CI runner only
# !!! DO NOT RUN THIS SCRIPT ON OUR OWN MACHINE !!!
# or it could mess up your apt/aws/kubectl config

# This script installs the aws cli, terraform
# and logs into the ECR docker registry, and sets up
# aws creds.
#
# Required environment variables:
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY

if [ "${GITHUB_ACTIONS}" != "true" ]; then
    echo "This script should only be run in a github actions workflow!"
    exit -1
fi

set -euo pipefail
set -x

mkdir -p /tmp/deps-install
cd /tmp/deps-install

# Install aws cli
sudo apt install python3-setuptools
pip3 install awscli --upgrade --user
aws --version

# Install terraform
curl -sSL "https://releases.hashicorp.com/terraform/0.12.30/terraform_0.12.30_linux_amd64.zip" > terraform.zip
unzip terraform.zip
sudo install ./terraform /usr/local/bin/

# Setup AWS creds
aws configure set aws_access_key_id "${AWS_ACCESS_KEY_ID}"
aws configure set aws_secret_access_key "${AWS_SECRET_ACCESS_KEY}"
aws configure set --profile experimentation role_arn arn:aws:iam::244796486130:role/OrbisExperimentationAccountAccess
aws configure set --profile experimentation source_profile default
aws configure set --profile testing role_arn arn:aws:iam::464205154305:role/OrbisTestingAccountAccess
aws configure set --profile testing source_profile default
aws configure set --profile staging role_arn arn:aws:iam::304729679812:role/OrbisStagingAccountAccess
aws configure set --profile staging source_profile default
aws configure set --profile production role_arn arn:aws:iam::987534643960:role/OrbisProductionAccountAccess
aws configure set --profile production source_profile default

# Login to ECR
eval $(aws ecr get-login --no-include-email --region eu-west-1)

# Test terraform version
terraform version
