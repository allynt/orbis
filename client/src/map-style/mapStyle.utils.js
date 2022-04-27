import { DEFAULT_LAYER_GROUPS } from './constants';

/**
 * Create the style for the top map
 *
 * @param {import('mapbox-gl').Style} mapStyle The base style to create from
 * @param {import('./constants').LayerGroupSlug[]} topMapLayerGroups LayerGroup slugs to show on the top map
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

/**
 * Create the style for the bottom map
 *
 * @param {import('mapbox-gl').Style} mapStyle The base style to create from
 * @param {import('./constants').LayerGroupSlug[]} topMapLayerGroups LayerGroup slugs to show on the top map
 * @returns {import('mapbox-gl').Style} The style filtered for the bottom map
 */
export const createBottomMapStyle = (mapStyle, topMapLayerGroups) => {
  const topMapLayerFilters = DEFAULT_LAYER_GROUPS.filter(layerGroup =>
    topMapLayerGroups.includes(layerGroup.slug),
  ).map(layerGroup => layerGroup.filter);

  const filteredLayers = mapStyle.layers?.filter(layer =>
    topMapLayerFilters.every(match => !match(layer)),
  );

  return { ...mapStyle, layers: filteredLayers };
};

const apiKey = '';
/**
 * Transform the URL if it matches an OS Data request, to include the API key
 * and Spatial Referencing System to be used.
 *
 * @param {string} url - Map data URL to possibly transform
 *
 * @return {object} - The transformed URL
 */
export const transformOSDataRequests = url => {
  if (url.includes('api.os.uk')) {
    if (!/[?&]key=/.test(url)) {
      url += `?key=${apiKey}`;
    }

    return {
      url: url + '&srs=3857',
    };
  }

  return { url };
};
