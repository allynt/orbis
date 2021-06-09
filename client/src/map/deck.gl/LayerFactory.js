import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { GeoJsonLayer, IconLayer, BitmapLayer } from '@deck.gl/layers';

import * as CustomLayers from './custom-layers';

/**
 * @type {{[ key in import('typings/orbis').LayerName ]: any}}
 */
const LAYER_CLASSES = {
  GeoJsonLayer,
  IconLayer,
  BitmapLayer,
  HeatmapLayer,
  ...CustomLayers,
};

/**
 * Factory function to return a new instance of a layer based on the provided class name and configuration.
 *
 * @param {import('typings/orbis').LayerName} className
 * @param {object} configuration
 *
 * @returns {LAYER_CLASSES[keyof LAYER_CLASSES]} an instance of the provided class
 */
export const LayerFactory = (className, configuration = {}) => {
  const Class = LAYER_CLASSES[className];
  return new Class(configuration);
};
