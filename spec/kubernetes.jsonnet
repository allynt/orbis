local appName = "orbis";
local tag = std.extVar('tag');
local envName = "testing-" + tag;
local registry = "339570402237.dkr.ecr.eu-west-1.amazonaws.com";
local repository = "company/orbis/django:" + tag;

local podLabels = {
  app: "orbis",
  environment: envName,
  tag: tag
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
     type: "ClusterIP",
     ports: [{
       name: "http",
       port: 80,
       targetPort: 8000
     }],
     selector: podLabels
    }
  })
}
