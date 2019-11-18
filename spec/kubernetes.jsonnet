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

local secretsMapping = {
  // maps the secret name to the environment variable name
  debug: "DJANGO_DEBUG",
  secret_key: "DJANGO_SECRET_KEY",
  db_host: "DJANGO_DB_HOST",
  db_port: "DJANGO_DB_PORT",
  db_name: "DJANGO_DB_NAME",
  db_user: "DJANGO_DB_USER",
  db_password: "DJANGO_DB_PASSWORD",
  email_host: "DJANGO_EMAIL_HOST",
  email_port: "DJANGO_EMAIL_PORT",
  email_user: "DJANGO_EMAIL_USER",
  email_password: "DJANGO_EMAIL_PASSWORD"
};


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
            env: [{ name: "SYS_ENV", value: deploymentType}] +
              [
                {name: secretsMapping[secret], valueFrom: { secretKeyRef: secretKeyName, key: secret}}
                for secret in std.objectFields(secretsMapping)
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
