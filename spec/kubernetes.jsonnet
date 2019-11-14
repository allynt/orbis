local appName = "orbis";
local branchName = std.extVar('branch');
local envName = "testing-" + branchName;
local registry = "339570402237.dkr.ecr.eu-west-1.amazonaws.com";
local repository = "company/orbis/django:master";

local podLabels = {
  app: "orbis",
  environment: envName,
  branch: branchName
};

local serviceLabels = podLabels;

{
  'deployment.json': std.manifestJson({
    apiVersion: "apps/v1",
    kind: "Deployment",
    metadata: {
      name: appName + "-" + envName,
    },
    spec: {
      selector: {
        matchLabels: podLabels,
      },
      replicas: 2,
      template: {
        metadata: {
          labels: podLabels,
        },
        spec: {
          containers: [{
            name: appName + "-" + envName,
            image: registry + "/" + repository,
            ports: [{ "containerPort": 8000 }],
          }]
        }
      }
    }
  }),

  'service.json': std.manifestJson({
    apiVersion: "v1",
    kind: "Service",
    metadata: {
      name: appName,
      labels: serviceLabels,
   },
   spec: {
     type: "NodePort",
     ports: [{
       name: "http",
       port: 80,
       targetPort: 8000
     }],
     selector: podLabels
    }
  }),

  'privatepods.json': std.manifestJson({
    apiVersion: "v1",
    kind: "Pod",
    metadata: {
      name: appName + "ecr-key",
    },
    spec: {
      containers: [{
        name: appName + "-" + envName + "ecr",
        image: registry + "/" + repository,
      }],
      imagePullSecrets: [{
        name: "regcred"
      },],
    }
  })
}
