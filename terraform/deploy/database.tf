#
# Database created for non-primary instances
#

resource "postgresql_database" "branch_db" {
  for_each = (var.instance == "primary") ? {} : { singleton = var.instance }

  lifecycle {
    ignore_changes = [
      lc_collate,
      lc_ctype
    ]
  }

  name       = local.instance_db_name
  owner      = data.kubernetes_secret.environment_secret.data["db_user"]
  template   = data.kubernetes_secret.environment_secret.data["db_name"]
  lc_ctype   = "DEFAULT"
  lc_collate = "DEFAULT"
}
