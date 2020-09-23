/**
 * @typedef {'label' | 'road' | 'border' | 'building' | 'water' | 'land' | '3d building'} LayerGroupSlug
 */

/**
 * @typedef LayerGroup
 * @property {LayerGroupSlug} slug - the identifier for the layer group
 * @property {(layer: { id: string }) => RegExpMatchArray | boolean} filter - function by which to filter the layers
 */

/**
 * @type {LayerGroup[]}
 */
export const DEFAULT_LAYER_GROUPS = [
  {
    slug: 'label',
    filter: ({ id }) => id.match(/(?=(label|place-|poi-))/),
  },
  {
    slug: 'road',
    filter: ({ id }) =>
      id.match(/(?=(road|railway|tunnel|street|bridge))(?!.*label)/),
  },
  {
    slug: 'border',
    filter: ({ id }) => id.match(/border|boundaries/),
  },
  {
    slug: 'building',
    filter: ({ id }) => id.match(/building/),
  },
  {
    slug: 'water',
    filter: ({ id }) => id.match(/(?=(water|stream|ferry))/),
  },
  {
    slug: 'land',
    filter: ({ id }) =>
      id.match(/(?=(parks|landcover|industrial|sand|hillshade))/),
  },
  {
    slug: '3d building',
    filter: () => false,
  },
];
