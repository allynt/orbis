#!/bin/bash

# This script is meant to be run by the CI runner only
# !!! DO NOT RUN THIS SCRIPT ON OUR OWN MACHINE !!!
# or it could mess up your apt/aws/kubectl config

# This script installs:
# * jsonnet
# * aws cli
# * kubectl
# * jq
#
# and logs into the ECR docker registry, and sets up
# aws and kubectl creds.
#
# Required environment variables:
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY
# AWS_ROLE

if [ "${GITHUB_ACTIONS}" != "true" ]; then
    echo "This script should only be run in a github actions workflow!"
    exit -1
fi

set -euo pipefail
set -x

mkdir -p /tmp/deps-install
cd /tmp/deps-install

# Install jsonnet
curl -sSL "https://github.com/google/jsonnet/releases/download/v0.14.0/jsonnet-bin-v0.14.0-linux.tar.gz" > ./jsonnet-bin-linux.tar.gz
tar -xzf ./jsonnet-bin-linux.tar.gz
sudo install ./jsonnet ./jsonnetfmt /usr/local/bin/
jsonnet --version

# Install aws cli
sudo apt install python3-setuptools
pip3 install awscli --upgrade --user
aws --version

# Install kubectl and jq
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl jq

# Install terraform
curl -sSL "https://releases.hashicorp.com/terraform/0.12.19/terraform_0.12.19_linux_amd64.zip" > terraform.zip
unzip terraform.zip
sudo install ./terraform /usr/local/bin/

# Setup AWS creds
aws configure set aws_access_key_id "${AWS_ACCESS_KEY_ID}"
aws configure set aws_secret_access_key "${AWS_SECRET_ACCESS_KEY}"
aws configure set --profile testing role_arn "${AWS_ROLE}"
aws configure set --profile testing source_profile default

# Login to ECR
eval $(aws ecr get-login --no-include-email --region eu-west-1)

# Update kubeconfig
aws eks --region eu-west-1 --profile testing update-kubeconfig --name orbis-platform-testing

# Test kubectl config
kubectl version

# Test terraform version
terraform version
