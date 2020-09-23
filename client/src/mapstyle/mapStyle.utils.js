/**
 * Create the style for the top map
 *
 * @param {import('mapbox-gl').Style} mapStyle The base style to create from
 * @returns {import('mapbox-gl').Style} The style filtered for the top map
 */
export const createTopMapStyle = mapStyle => ({
  ...mapStyle,
  layers: [],
});
