#!/usr/bin/env node

// TODO: Break this out into a dedicated reusable GitHub Action in a seperate repo

const { program } = require('commander');

program.version('0.0.1');

program
  .requiredOption('-n, --repo-name <repo>',   'the repo name e.g. orbis')
  .requiredOption('-o, --repo-owner <github org>',  'the repo owner e.g. astrosat', 'astrosat')
  .requiredOption('-e, --environment <environment>', 'name of the environment to deploy to e.g. testing, staging', 'testing')

// This script is designed to work with apps that support dynamic instances.
// Not all apps support dynamic instances.
const SUPPORTED_REPOS = [
  'astrosat/orbis'
];

// Initialise libraries
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const AWS = require("aws-sdk");
var credentials = new AWS.SharedIniFileCredentials({profile: 'testing'});
AWS.config.credentials = credentials;


// Create a deployment directly using a GitHub Personal Access Token
const createDeploymentUsingGithub = ({owner, repo, ref, environment}) => {

  console.debug("Creating deployment using GitHub API");

  return octokit.repos.createDeployment({
    owner: owner,
    repo: repo,
    ref: ref,
    environment: environment,
    auto_merge: false,
    required_contexts: []
  });
};

// If running inside GitHub Actions, they do not allow recursive workflows
// so we have to proxy the creation of the deployment via a lambda in order to
// trigger the deployment workflow.
const createDeploymentUsingLambda = (payload) => {
  const lambda = new AWS.Lambda({region: 'eu-west-1'});

  console.debug("Creating deployment using Lambda");

  const params = {
    FunctionName: 'testing-create-github-deployment',
    Payload: JSON.stringify(payload)
  };

  return new Promise((resolve, reject) => lambda.invoke(params, (err, data) => err ? reject(err) : resolve(data)));
};


// Chooses which deployment mechanism to use
const createDeployment =
      (process.env.GITHUB_ACTIONS === "true") ?
        createDeploymentUsingLambda : createDeploymentUsingGithub;


// Gets the PR numbers for a given commit
const prsForCommit = (repoOwner, repoName, commitSha) => {
  const args = {
    owner: repoOwner,
    repo: repoName,
    commit_sha: commitSha
  };

  return new Promise((resolve, reject) => {
    octokit.repos.listPullRequestsAssociatedWithCommit(args).then(
      (result) => {
        const prNums = result.data.filter(pr => pr.state === "open").map(pr => pr.number);
        resolve(prNums);
      }
    ).catch(reject);
  });
};

const deployToInstance = (instanceName, commitSha) => {
  const payload = {
    "owner": program.repoOwner,
    "repo": program.repoName,
    "ref": commitSha,
    "environment": `${program.environment}-${instanceName}`
  };

  console.log('deploy', payload);
  return createDeployment(payload);
};

// Errors shouldn't immediately exit, to allow for parallel tasks to clean up
const handleError = (...args) => {
  console.error(...args);
  process.exitCode = 1;
}

// Ensure that we only create deployments for repos that support dynamic instances
const checkRepoOption = () => {
  if (!SUPPORTED_REPOS.includes(`${program.repoOwner}/${program.repoName}`)) {
    console.error(`Error: repo ${program.repoOwner}/${program.repoName} is not known to support dynamic instances.`);
    process.exit(1);
  }
};

program.command('deploy-primary')
  .description("Deploys to the environment's primary instance")
  .requiredOption('-c, --commit <sha>', 'commit sha to deploy')
  .action((options) => {
    checkRepoOption();
    deployToInstance('primary', options.commit).catch(handleError);
});

program.command('deploy-associated-prs')
  .description('Deploys to all PR instances of PRs associated with the given commit')
  .requiredOption('-c, --commit <sha>', 'commit sha to deploy')
  .action(async (options) => {
    checkRepoOption();

    const prs = await prsForCommit(program.repoOwner, program.repoName, options.commit).catch(handleError);

    if(prs.length > 0) {
      await Promise.allSettled(
        prs.map(
          prNum => deployToInstance(`pr-${prNum}`, options.commit).then(
            () => console.log(`Created deployment of ${options.commit} to PR ${program.repoOwner}/${program.repoName}#${prNum}`)
          ).catch(handleError)
        )
      )

    } else {
      console.log('No PRs found for this commit.')
    }
  });

program.command('deploy-pr')
  .description('Deploys the HEAD of a given PR to its PR instance. Optionally specify commit instead of using PR HEAD.')
  .requiredOption('-p, --pull-request <num>', 'The PR number to deploy this commit to')
  .option('-c, --commit <sha>', 'commit sha to deploy')
  .action(async (options) => {
    checkRepoOption();

    const prNum = parseInt(options.pullRequest);

    // Get the HEAD commit of the PR
    const prData = await octokit.pulls.get({
        owner: program.repoOwner,
        repo: program.repoName,
        pull_number: prNum
    }).catch(handleError);

    const prHeadCommitSha = prData.data.head.sha;

    const commitSha = options.commit ? options.commit : prHeadCommitSha;

    // Check that the commit as associated with the PR
    const commitPrs = await prsForCommit(program.repoOwner, program.repoName, commitSha).catch(handleError);

    if (commitPrs.includes(prNum)) {
      await deployToInstance(`pr-${prNum}`, commitSha).catch(handleError);
      console.log(`Created deployment of ${commitSha} to PR ${program.repoOwner}/${program.repoName}#${prNum}`);
    } else {
      handleError(`Error: Commit ${commitSha} is not associated with PR ${program.repoOwner}/${program.repoName}#${prNum}. Is the PR closed or merged? If you specified the --commit option, check that it is correct.`);
    }
  });

program.parse(process.argv);
