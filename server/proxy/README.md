# proxy

- [orbis](#proxy)
  - [Overview](#overview)
  - [Features](#features)
  - [Models] (#models)
  - [Metadata](#metadata)

## Overview

This **proxy-data-server** acts as a registry of `DataSources` that are fetched from a remote API.  It is used as a proxy to add any required authentication token to the request and any required post-processing to the response.

## Features

* Hooks into the existing **orbis** and **data-sources-directory** data-licencing system; simply create a `DataSource` in **data-sources-directory** that points to a `ProxyDataSource` in **proxy-data-server**.
* Responses are paginated by default.

## Models

A `ProxyDataSource` uses the same `source_id` structure as any other `DataSource`.  The following fields can be used to describe how to connect to the remote (proxied) server:

* `proxy_url`: the remote URL
* `proxy_method`: whether the request should be "GET" or "POST"
* `proxy_authentication_type`: the type of authentication the remote server uses (including "URL_Param", described below)
* `proxy_authetnication_token`: the authentication token; used by _some_ authentication types
* `proxy_authetnication_username`: the authentication username; used by _some_ authentication types
* `proxy_authetnication_password`: the authentication password; used by _some_ authentication types
* `proxy_params`: a set of query parameters to be sent as part of the proxied request
* `adapter_name`: the name of an adapter to convert the proxied result to **orbis**-ready GeoJSON; the adapter performs post-processing

## Metadata

The metadata of the `DataSource` ought to look something like this:


```Javascript
{
    "url": "https://api.staging.orbis.astrosat.net/api/proxy/data/astrosat/proxy/exactearth/latest/?page={p}",
    "name": "exactearth",
    "label": "Live AIS Data (from exactEarth)",
    "request_strategy": "manual",
    "application": {
        "orbis": {
            "categories": {
                "name": "Automatic Identification Sytem (AIS) Shipping Data"
            },
            "layer": {
                "name": "GeoJsonClusteredIconLayer",
                "props": {
                    "config": "aisShippingConfig"
                }
            },
            "map_component": {
                "name": "AisShippingMapComponent"
            },
            "sidebar_component": {
                "name": "AisShippingSidebarComponent",
                "props": {
                    "searchRadius": 3
                }
            }
        }
    },
    "description": "AIS live data from exactEarth"
}
```
