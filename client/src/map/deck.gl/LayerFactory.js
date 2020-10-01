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
 * Factory function to return a new instance of a layer based on the provided class name and configuration.
 *
 * @param {LayerName} className
 * @param {object} configuration
 *
 * @returns {LAYER_CLASSES[keyof LAYER_CLASSES]} an instance of the provided class
 */
export const LayerFactory = (className, configuration = {}) => {
  const Class = LAYER_CLASSES[className];
  return new Class(configuration);
};
