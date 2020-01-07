#!/bin/bash

# This script copies AWS Secrets to Kubernetes Secrets

USAGE="Usage: `basename $0` <aws-secret-name> <kubernetes-secret-name>"

if [ "$#" -ne 2 ]; then
  echo $USAGE && exit
fi

AWS_SECRET=$1
KUBE_SECRET=$2

kubectl delete secret $KUBE_SECRET
kubectl create secret generic $KUBE_SECRET --from-env-file=<(aws secretsmanager get-secret-value --secret-id $AWS_SECRET | jq -r '.SecretString' | jq -r 'to_entries | .[] | .key +"=" + .value')
