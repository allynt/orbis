import { MVTLayer } from 'deck.gl';
import parseMVT from './parse-mvt';

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

export default class CustomMvtLayer extends MVTLayer {
  getTileData(tile) {
    const url = getURLFromTemplate(this.props.data, tile);
    if (!url) {
      return Promise.reject('Invalid URL');
    }
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${this.props.authToken}`,
      },
    })
      .then(res => {
        if (res.status === 200) return res.arrayBuffer();
        return null;
      })
      .then(buffer => {
        if (buffer) {
          return parseMVT(buffer);
        }
      });
  }
}
