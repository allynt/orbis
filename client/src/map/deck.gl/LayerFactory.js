import { GeoJsonLayer } from '@deck.gl/layers';
import * as CustomLayers from './custom-layers';

/**
 * @type {{[ key in LayerName ]: any}}
 */
const LAYER_CLASSES = {
  GeoJsonLayer,
  ...CustomLayers,
};

/**
 * @param {Source} source
 */
const selectLayerName = source => source.metadata.application.orbis.layer.name;

/**
 * Factory function to return a new instance of a layer based on the provided source.
 *
 * @param {Source} source - The name of the layer class to use
 */
export const LayerFactory = source => {
  const Class = LAYER_CLASSES[selectLayerName(source)];
  return new Class();
};
