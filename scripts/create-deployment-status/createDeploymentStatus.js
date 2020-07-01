#!/usr/bin/env node

// TODO: Break this out into a dedicated reusable GitHub Action in a seperate repo

const { program } = require('commander');

program.version('0.0.1');

program
  .description('Sets the status for a GitHub deployment')
  .requiredOption('-o, --repo-owner <github org>',  'the repo owner e.g. astrosat', 'astrosat')
  .requiredOption('-n, --repo-name <repo>',   'the repo name e.g. orbis')
  .requiredOption('-e, --environment <environment>', 'name of the GitHub environment to set the status for e.g. testing-pr-123')
  .requiredOption('-s, --status <status>', 'the status to set e.g. success, failure, pending, inactive ')
  .option('-i, --auto-inactive', 'set the previous deployments of this environment to inactive')


// Initialise libraries
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  previews: ["flash-preview", "ant-man-preview"] // Needed to be able to use 'inactive' as a status
});


const handleError = (...args) => {
  console.error(...args);
  process.exitCode = 1;
}


program.action(async () => {
  // Lookup the deployment ID from the environment name
  const deployments = await octokit.repos.listDeployments({
    owner: program.repoOwner,
    repo: program.repoName,
    environment: program.environment
  }).catch(handleError);

  if(deployments.data.length < 1) {
    handleError(`Error: No deployments found for repo ${program.repoOwner}/${program.repoName} environment ${program.environment}`);

  } else {
    // The first one should be the most recent
    const deploymentId = deployments.data[0].id;

    console.log(`Setting deployment ${deploymentId} to status ${program.status}`);

    await octokit.repos.createDeploymentStatus({
      owner: program.repoOwner,
      repo: program.repoName,
      deployment_id: deploymentId,
      state: program.status,
      auto_inactive: (program.autoInactive == true)
    }).catch(handleError);
  }


});

program.parse(process.argv);
