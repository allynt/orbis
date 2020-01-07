/*
 * This file generates the kubernetes definitions required for branch-based
 * deploys to the testing environment.
 * It is NOT to be used for deploying to staging/production.
 */

local envName = "testing";
local baseDomain = ".testing.or3is.com";
local secretKeyName = "orbis-secrets";
local registry = "339570402237.dkr.ecr.eu-west-1.amazonaws.com";
local repository = "company/orbis/django";
local deploymentType = "deployment";  // "[deployment|development]"

local branch = std.extVar('branch');
local tag = std.extVar('tag');

local appName   = "orbis-" + envName + "-" + branch;
local subdomain = "app-" + branch;
local appImage  = registry + "/" + repository + ":" + tag;

local djangoDbNameEnv =
  if branch == "master" then
    { name: "DJANGO_DB_NAME", valueFrom: {secretKeyRef: { name: secretKeyName, key: "db_name"}}}
  else
    { name: "DJANGO_DB_NAME", value: "orbisapplication_branch_" + branch };

local podLabels = {
  app: "orbis",
  environment: envName,
  branch: branch
};

local serviceLabels = podLabels;

local deployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    name: appName,
  },
  spec: {
    selector: {
      matchLabels: podLabels,
    },
    replicas: 1,
    template: {
      metadata: {
        labels: podLabels,
      },
      spec: {
        containers: [{
          name: appName,
          image: appImage,
          ports: [{ "containerPort": 8000 }],
          env: [
            { name: "SYS_ENV", value: deploymentType},
            { name: "DJANGO_SITE_DOMAIN", value: subdomain + baseDomain},
            { name: "DJANGO_DEBUG", valueFrom: {secretKeyRef: { name: secretKeyName, key: "debug"}}},
            { name: "DJANGO_SECRET_KEY", valueFrom: {secretKeyRef: { name: secretKeyName, key: "secret_key"}}},
            { name: "DJANGO_DB_HOST", valueFrom: {secretKeyRef: { name: secretKeyName, key: "db_host"}}},
            { name: "DJANGO_DB_PORT", valueFrom: {secretKeyRef: { name: secretKeyName, key: "db_port"}}},
            djangoDbNameEnv,
            { name: "DJANGO_DB_USER", valueFrom: {secretKeyRef: { name: secretKeyName, key: "db_user"}}},
            { name: "DJANGO_DB_PASSWORD", valueFrom: {secretKeyRef: { name: secretKeyName, key: "db_password"}}},
            { name: "DJANGO_EMAIL_HOST", valueFrom: {secretKeyRef: { name: secretKeyName, key: "email_host"}}},
            { name: "DJANGO_EMAIL_PORT", valueFrom: {secretKeyRef: { name: secretKeyName, key: "email_port"}}},
            { name: "DJANGO_EMAIL_USER", valueFrom: {secretKeyRef: { name: secretKeyName, key: "email_user"}}},
            { name: "DJANGO_EMAIL_PASSWORD", valueFrom: {secretKeyRef: { name: secretKeyName, key: "email_password"}}}
            { name: "DJANGO_MAPBOX_TOKEN", valueFrom: {secretKeyRef: { name: secretKeyName, key: "mapbox_token"}}}
            { name: "DJANGO_TRACKING_ID", valueFrom: {secretKeyRef: { name: secretKeyName, key: "tracking_id"}}}

          ]
        }]
      }
    }
  }
};

local service = {
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
     targetPort: 80
   }],
   selector: podLabels
  }
};

local ingress = {
  apiVersion: "extensions/v1beta1",
  kind: "Ingress",
  metadata: {
    name: appName,
    labels: {
      traefik: "external"
    }
  },
  spec: {
  rules: [
    {
      host: subdomain + baseDomain,
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
  ]
 }
};


{

  'deployment.json': std.manifestJson(deployment),
  'service.json': std.manifestJson(service),
  'ingress.json': std.manifestJson(ingress)
}
