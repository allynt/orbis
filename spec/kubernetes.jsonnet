local appName = "orbis";
local tag = std.extVar('tag');
local deploymentType = "deployment";  // "[deployment|development]"
local envName = "testing";
local registry = "339570402237.dkr.ecr.eu-west-1.amazonaws.com";
local repository = "company/orbis/django:" + tag;
local secretKeyName = "orbis-secrets";

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
              { name: "SYS_ENV", value: deploymentType},
              { name: "DJANGO_DEBUG", valueFrom: {secretKeyRef: { name: secretKeyName, key: "debug"}}},
              { name: "DJANGO_SECRET_KEY", valueFrom: {secretKeyRef: { name: secretKeyName, key: "secret_key"}}},
              { name: "DJANGO_DB_HOST", valueFrom: {secretKeyRef: { name: secretKeyName, key: "db_host"}}},
              { name: "DJANGO_DB_PORT", valueFrom: {secretKeyRef: { name: secretKeyName, key: "db_port"}}},
              { name: "DJANGO_DB_NAME", valueFrom: {secretKeyRef: { name: secretKeyName, key: "db_name"}}},
              { name: "DJANGO_DB_USER", valueFrom: {secretKeyRef: { name: secretKeyName, key: "db_user"}}},
              { name: "DJANGO_DB_PASSWORD", valueFrom: {secretKeyRef: { name: secretKeyName, key: "db_password"}}},
              { name: "DJANGO_EMAIL_HOST", valueFrom: {secretKeyRef: { name: secretKeyName, key: "email_host"}}},
              { name: "DJANGO_EMAIL_PORT", valueFrom: {secretKeyRef: { name: secretKeyName, key: "email_port"}}},
              { name: "DJANGO_EMAIL_USER", valueFrom: {secretKeyRef: { name: secretKeyName, key: "email_user"}}},
              { name: "DJANGO_EMAIL_PASSWORD", valueFrom: {secretKeyRef: { name: secretKeyName, key: "email_password"}}}
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
  }),

  'ingres.json': std.manifestJson({
    apiVersion: "extensions/v1beta1",
    kind: "Ingress",
    metadata: {
      name: appName,
      labels: {
        traefik: "external"
      }
   },
   spec: {
    rules: {
      host: "app.testing.or3is.com",
      http: {
        paths: [
          {
            path: "/",
            backend: {
              serviceName: appName,
              servicePort: "http"
            }
          }
        ]
      }
    }
   }
  })

}
