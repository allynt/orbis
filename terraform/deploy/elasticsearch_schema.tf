locals {
  es_index_template = {

    # Which indices should this template apply to
    # here we only apply to the template created by this instance
    "index_patterns" = [
      "app-analytics-${local.app}-${var.instance}-${var.environment}-*",
    ],

    "settings" = {
      "index" = {
        "number_of_shards"   = "1",
        "number_of_replicas" = "0",
      },
    },

    "mappings" = {
      "_source" = {
        "enabled" = true
      },

      // For the data types available and when to use them
      // See: https://www.elastic.co/guide/en/elasticsearch/reference/7.9/mapping-types.html

      "properties" = {

        // Every document must have a timestamp of when it was created
        "@timestamp" = { "type" = "date" }

        // "app", "instance" and "environment" are required for index routing
        // e.g. app = "orbis", instance = "primary", environment = "testing"
        "app"         = { "type" = "keyword" },
        "instance"    = { "type" = "keyword" },
        "environment" = { "type" = "keyword" },

        // The top-level "type" field determines what type of event this is
        "type" = { "type" = "keyword" },

        // Possible types:
        //
        // orbisUserAction   - when the user does something in the orbis app frontend
        // orbisClientError  - the orbis app frontend has an error that we need to keep track of
        // orbisServerError  - the orbis app backend has an error that we need to keep track of
        // dailyMetrics      - an event generated once per day with the most recent values of
        //
        "orbisUserAction" = {
          "type" = "object",
          "properties" = {
            // "action" field says which action was performed
            "action"       = { "type" = "keyword" },

            // Possible user actions:
            //
            // userLogin       - When a user successfully logs in (backend)
            // loadLayer       - When a user adds a layer from the add/remove data panel (frontend)
            // customerCreated - When a new users signs up to create a customer (backend)

            // The user session where the action was performed, relevent to every user action
            "sessionId"    = { "type" = "keyword" },
            "userId"       = { "type" = "keyword" },
            "customerId"   = { "type" = "keyword" },
            "customerName" = { "type" = "keyword" },

            // Properties specific to each kind of user action
            "userLogin" = {
              "type" = "object",
              "properties" = {
                /* no specific properties */
              }
            }

            "loadLayer" = {
              "type" = "object",
              "properties" = {
                "dataset" = { "type" = "keyword" }
              }
            }

            "customerCreated" = {
              "type" = "object",
              "properties" = {
                "customerCreatedAt" = { "type" = "date" }
              }
            }

          }
        },

        "orbisClientError" = {
          "type" = "object",
          "properties" = {
            // "error" field says which error happened
            "error" = { "type" = "keyword" },

            // The user session where this error happened (if available)
            "sessionId"    = { "type" = "keyword" },
            "userId"       = { "type" = "keyword" },
            "customerId"   = { "type" = "keyword" },
            "customerName" = { "type" = "keyword" },

            // Possible errors
            //
            // loadLayerError - layer data failed to load
            //
            "loadLayerError" = {
              "type" = "object",
              "properties" = {
                "dataset" = { "type" = "keyword" }
              }
            }
          }
        },

        "orbisServerError" = {
          "type" = "object",
          "properties" = {
            // "error" field says which error happened
            "error" = { "type" = "keyword" },
          }
        },

        "dailyMetrics" = {
          "type" = "object",
          "properties" = {
            /* TODO */
          },
        }

      }

    }

  }
}

resource "elasticsearch_index_template" "app_analytics" {
  name = "app-analytics-${local.app}-${var.instance}-${var.environment}"

  body = jsonencode(local.es_index_template)
}
