/*
 * This file generates the kubernetes definition file for a job that will
 * create or delete a database for branch-based deploys.
 */

local branch = std.extVar("branch");
local action = std.extVar("action"); // either "create" or "delete"
local jobName = action + "-branch-db-" + branch;
local secretKeyName = "orbis-secrets";

local newDbName = "orbisapplication_branch_" + branch;

local sqlCommand =
    if action == "create" then 
        'CREATE DATABASE \\\"%s\\\" WITH TEMPLATE ${PGDATABASE} OWNER ${PGUSER};' % newDbName
    else if action == "delete" then
        'DROP DATABASE \\\"%s\\\";' % newDbName
    else 
        error "Unknown action: %s" % action;

local jobScript = |||
    n=0;
    until [ $n -ge 15 ]; do
        psql --command="%s" && break;
        let "n=n+1";
        sleep 10;
    done
||| % sqlCommand;

{
    'job.json': std.manifestJson({
        apiVersion: "batch/v1",
        kind: "Job",
        metadata: {
            name: jobName
        },
        spec: {
            backoffLimit: 6,
            template: {
                spec: {
                    restartPolicy: "Never",
                    containers: [{
                        name: jobName,
                        image: "postgres:11",
                        env: [
                            { name: "PGHOST", valueFrom: {secretKeyRef: { name: secretKeyName, key: "db_host"}}},
                            { name: "PGPORT", valueFrom: {secretKeyRef: { name: secretKeyName, key: "db_port"}}},
                            { name: "PGDATABASE", valueFrom: {secretKeyRef: { name: secretKeyName, key: "db_name"}}},
                            { name: "PGUSER", valueFrom: {secretKeyRef: { name: secretKeyName, key: "db_user"}}},
                            { name: "PGPASSWORD", valueFrom: {secretKeyRef: { name: secretKeyName, key: "db_password"}}}
                        ],
                        command: ["bash", "-c", jobScript]
                    }]
                }
            }
        }
    })
}