# This isn't a script that's intended to be run
# but contains common code for both `deploy.sh` and `undeploy.sh`

TERRAFORM_BINARY="terraform-1"
TERRAFORM_WORKSPACE="environment-${ENVIRONMENT}-${INSTANCE}"
export TERRAGRUNT_TFPATH="$TERRAFORM_BINARY"

echo "ENVIRONMENT=$ENVIRONMENT"
echo "INSTANCE=$INSTANCE"

echo "TERRAFORM_WORKSPACE=$TERRAFORM_WORKSPACE"
