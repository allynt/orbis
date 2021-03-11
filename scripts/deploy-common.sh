# This isn't a script that's intended to be run
# but contains common code for both `deploy.sh` and `undeploy.sh`

echo "ENVIRONMENT=$ENVIRONMENT"
echo "INSTANCE=$INSTANCE"

TERRAFORM_BINARY="terraform-0.13"
TERRAFORM_WORKSPACE="environment-${ENVIRONMENT}-${INSTANCE}"
