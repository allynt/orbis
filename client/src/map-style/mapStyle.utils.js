import { DEFAULT_LAYER_GROUPS } from './constants';

/**
 * Create the style for the top map
 *
 * @param {import('mapbox-gl').Style} mapStyle The base style to create from
 * @param {string[]} topMapLayerGroups LayerGroup slugs to show on the top map
 * @returns {import('mapbox-gl').Style} The style filtered for the top map
 */
export const createTopMapStyle = (mapStyle, topMapLayerGroups) => {
  const topMapLayerFilters = DEFAULT_LAYER_GROUPS.filter(layerGroup =>
    topMapLayerGroups.includes(layerGroup.slug),
  ).map(layerGroup => layerGroup.filter);

  const filteredLayers =
    mapStyle.layers?.filter(layer =>
      topMapLayerFilters.some(match => match(layer)),
    ) || [];

  return {
    ...mapStyle,
    layers: filteredLayers,
  };
};
