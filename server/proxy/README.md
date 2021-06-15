# proxy

- [orbis](#proxy)
  - [Overview](#overview)
  - [Features](#features)
  - [Metadata](#metadata)

## Overview

This **proxy-data-server** acts as a registry of `DataSources` that are fetched from a remote API.  It is used as a proxy to add any required authentication token to the request and any required post-processing to the response.

## Features

* Hooks into the existing **orbis** and **data-sources-directory** data-licencing system; simply create a `DataSource` in **data-sources-directory** that points to a `ProxyDataSource` in **proxy-data-server**.
* Responses are paginated by default.

## Metadata

The metadata of the `DataSource` ought to look something like this:

TODO: I AM HERE

```Javascript
{
    "url": "httpw://proxy-data-server.astrosat.net/api/proxy/<authority>/<namespace>/<name>/<version>/?page={p}"
    "label": "Some Proxied Data",
    "request_strategy": "manual",
    "application": {
        "orbis": {
            "categories": {
                "name": "Some Category"
            },
            "layer": {
                "name": "IconLayer",
                "props": {
                    "config": "<whateverConfig>"
                }
            },
            "map_component": {
                "name": "ActionForHelpMapComponent"
            },
            "sidebar_component": {
                "name": "CheckboxFilters",
                "props": {
                    "color": "#46aac4",
                    "filters": [
                        {
                            "icon": "Stethoscope",
                            "label": "Something",
                            "value": "Cargo, all ships of this type"
                        }
                    ]
                }
            }
        }
    },
    "description": "Sample Proxy Data"
}
```

The metadata of
