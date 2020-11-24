import { load } from '@loaders.gl/core';
import { MVTLoader } from '@loaders.gl/mvt';
import { MVTLayer } from '@deck.gl/geo-layers';
import { gunzipSync } from 'zlib';

import { logError } from 'data-layers/data-layers.slice';

/**
 * @typedef Tile
 * @property {number} x x index of the tile
 * @property {number} y y index of the tile
 * @property {number} z z index of the tile
 * @property {string} url resolved url of the tile if the data prop is provided, otherwise null
 * @property {{ west: number, north: number, east: number, south: number } |
 *            { left: number, top: number, bottom: number, right: number }
 * } bbox bounding box of the tile. When used with a geospatial view, bbox is in the shape of {west: <longitude>, north: <latitude>, east: <longitude>, south: <latitude>}.
 *        When used with a non-geospatial view, bbox is in the shape of {left, top, right, bottom}
 */

/**
 * Taken from https://github.com/visgl/deck.gl/blob/2b15bc459c6534ea38ce1153f254ce0901f51d6f/modules/geo-layers/src/tile-layer/utils.js#L32 under MIT Licence
 *
 * Converts a tile server URL template to a complete URL using properties object.
 *
 * @param {string | string[]} template A URL template for a tile server including "/{x}/{y}/{z}/" substring
 * @param {Tile} properties - the tile properties to create a URL from
 */
function getURLFromTemplate(template, properties) {
  if (!template || !template.length) {
    return null;
  }
  if (Array.isArray(template)) {
    const index = Math.abs(properties.x + properties.y) % template.length;
    template = template[index];
  }
  return template.replace
    ? template.replace(
        /\{ *([\w_-]+) *\}/g,
        (_, property) => properties[property],
      )
    : null;
}

/**
 * An extended version of deck.gl's MVTLayer to allow for
 * the way our vector-data-server works.
 *
 * Adds an `authToken` property which is added to the authorization header
 * and unzips the file before handing off to loaders.gl for conversion
 *
 * MVTLayer docs https://deck.gl/docs/api-reference/geo-layers/mvt-layer
 */
export class CustomMVTLayer extends MVTLayer {
  async getTileData(tile) {
    const url = getURLFromTemplate(this.props.data, tile);
    if (!url) {
      return Promise.reject('Invalid URL');
    }

    let response = null;
    try {
      response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.authToken}`,
        },
      });
    } catch (ex) {
      return this.props.dispatch(logError({ source_id: this.props.id }));
    }

    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer)
      return load(gunzipSync(Buffer.from(arrayBuffer)), MVTLoader);
  }
}
