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
{
    "url": "http://localhost:8000/api/proxy/data/astrosat/proxy/exactearth/latest?page={p}",
    "name": "exactearth",
    "label": "AIS Data (from exactEarth)",
    "request_strategy": "manual",
    "application": {
        "orbis": {
            "categories": {
                "name": "Automatic Identification Sytem (AIS) Shipping Data"
            },
            "layer": {
                "name": "GeoJsonClusteredIconLayer",
                "props": {
                    "config": "proxyConfig"
                }
            },
            "map_component": {
                "name": "ActionForHelpMapComponent"
            },
            "sidebar_component": {
                "name": "ProxySidebarComponent",
                "props": {
                    "searchRadius": 3
                }
            }
        }
    },
    "description": "AIS live data from exactEarth"
}
}
```

The metadata of
