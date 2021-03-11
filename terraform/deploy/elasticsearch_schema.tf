locals {
  es_index_template = {
    "template" = "app-analytics-${local.app}-${var.instance}-${var.environment}-*",

    "settings" = {
      "number_of_shards"   = 1,
      "number_of_replicas" = 0,
    },

    "mappings" = {
      "_source" = {
        "enabled" = true
      },

      "properties" = {
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

            // The user session where the action was performed
            "sessionId"    = { "type" = "keyword" },
            "userId"       = { "type" = "keyword" },
            "customerId"   = { "type" = "keyword" },
            "customerName" = { "type" = "keyword" },

            // Possible user actions
            // loadLayer - they used the data picker to load a dataset
            "loadLayer" = {
              "type" = "object",
              "properties" = {
                "dataset" = { "type" = "keyword" }
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
