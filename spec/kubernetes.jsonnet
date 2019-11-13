local appName = "whoami";
local branchName = std.extVar('branch');
local envName = "testing-" + branchName;

local podLabels = {
  app: "whoami",
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
            image: "jwilder/whoami",
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
  })
}
