import { load } from '@loaders.gl/core';
import { MVTLoader } from '@loaders.gl/mvt';
import { MVTLayer } from 'deck.gl';
import { gunzipSync } from 'zlib';

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
export default class CustomMVTLayer extends MVTLayer {
  async getTileData(tile) {
    const url = getURLFromTemplate(this.props.data, tile);
    if (!url) {
      return Promise.reject('Invalid URL');
    }
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.props.authToken}`,
      },
    });
    if (res.status !== 200) return null;
    const buffer = await res.arrayBuffer();
    if (buffer) return load(gunzipSync(Buffer.from(buffer)), MVTLoader);
  }
}
