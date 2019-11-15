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
            env: [
              {
                name: DJANGO_DB_HOST,
                valueFrom: {
                  secretKeyRef: {
                    name: orbis-secrets,
                    key: db_host
                  }
                }
              },
              {
                name: DJANGO_DB_PORT,
                valueFrom: {
                  secretKeyRef: {
                    name: orbis-secrets,
                    key: db_port
                  }
                }
              },
              {
                name: DJANGO_DB_NAME,
                valueFrom: {
                  secretKeyRef: {
                    name: orbis-secrets,
                    key: db_name
                  }
                }
              },
              {
                name: DJANGO_DB_USER,
                valueFrom: {
                  secretKeyRef: {
                    name: orbis-secrets,
                    key: db_user
                  }
                }
              },
              {
                name: DJANGO_DB_PASSWORD,
                valueFrom: {
                  secretKeyRef: {
                    name: orbis-secrets,
                    key: db_password
                  }
                }
              }
            ]
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
