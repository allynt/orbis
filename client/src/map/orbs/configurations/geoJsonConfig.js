import { GeoJsonLayer } from '@deck.gl/layers';

import { hexToRgbArray } from 'utils/color';

import { dataSelector, visibilitySelector } from '../layers.slice';

export const DEFAULT_COLOR = '#000000';

/** @type {import("typings/orbis").LayerConfiguration} */
export default ({
  id,
  activeSources,
  orbState,
  color,
  filled,
  authToken,
  ...rest
}) => {
  const source = activeSources?.find(source => source.source_id === id);
  const data = dataSelector(id)(orbState);
  const visible = visibilitySelector(id)(orbState);

  console.log('foo');
  console.log(color);

  /* a layer can be filled or not-filled */
  color = color ? hexToRgbArray(color) : hexToRgbArray(DEFAULT_COLOR);

  /* get color from props */
  /* if filled: fillcolor=whatever, linecolor=transparent, highlightcolor=whatever-inverse */
  /* if not filled: fillcolor=transparent, linecolor=whatever, highlightcolor=whatever-inverse */
  return {
    id,
    data,
    orbState,
    visible,
    pickable: true,
    autoHighlight: true,
    filled: true,
    stroked: true,
    getLineWidth: 2,
    lineWidthMinPixels: 2,
    getLineColor: color, //[255, 0, 0, 255],
    getFillColor: [0, 0, 0, 0],
    // minZoom: source?.metadata?.minZoom,
    // maxZoom: source?.metadata?.maxZoom,
    loadOptions: {
      fetch: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    },
    ...rest,
  };
};
