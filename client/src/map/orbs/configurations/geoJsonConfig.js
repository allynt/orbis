// @ts-ignore
import { GeoJsonLayer } from '@deck.gl/layers';

import { hexToRgbArray } from 'utils/color';

import { dataSelector, visibilitySelector } from '../layers.slice';

export const DEFAULT_LINE_COLOR = '#00ff00';
export const DEFAULT_FILLED_COLOR = '#006400';
export const DEFAULT_HIGHLIGHT_COLOR = '#483D8B';

export const STROKED_TRANSPARENT_COLOR = [0, 255, 0, 0];
export const FILLED_TRANSPARENT_COLOR = [0, 100, 0, 0];

/** @type {import("typings/orbis").LayerConfiguration} */

/**
 * @param {{
 *   id: string
 *   filled: boolean
 *   stroked: boolean
 *   activeSources?: import('typings').Source[]
 *   orbState: import('../orbReducer').OrbState
 *   authToken?: string
 * }} parameters
 */
const geoJsonConfiguration = ({
  id,
  activeSources,
  orbState,
  filled,
  stroked,
  //@ts-ignore
  lineColor,
  // @ts-ignore
  filledColor,
  //@ts-ignore
  highlightColor,
  authToken,
  ...rest
}) => {
  // @ts-ignore
  const source = activeSources?.find(source => source.source_id === id);
  const data = dataSelector(id)(orbState);
  const visible = visibilitySelector(id)(orbState);
  stroked = stroked ? true : false;
  // filled = filled || filled === undefined ? true : false;

  console.log('Showed filled value', filled);
  console.log('Stroked value', stroked);
  console.log('Color', lineColor);

  /* a layer can be filled or not-filled */
  lineColor = lineColor
    ? hexToRgbArray(lineColor)
    : hexToRgbArray(DEFAULT_LINE_COLOR);

  console.log(lineColor);
  filledColor = filledColor
    ? hexToRgbArray(filledColor)
    : hexToRgbArray(DEFAULT_FILLED_COLOR);

  highlightColor = highlightColor
    ? hexToRgbArray(highlightColor)
    : hexToRgbArray(DEFAULT_HIGHLIGHT_COLOR);

  function getFilledColor() {
    // console.log('hello');
    if (filled || filled === undefined) {
      return filledColor;
    }
  }

  function getLineColor() {
    if (stroked || stroked === undefined) {
      return lineColor;
    }
  }
  // filled = false;
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
    filled,
    stroked,
    // extruded: false,
    // pointType: 'circle',
    getLineWidth: 2,
    lineWidthMinPixels: 1,
    getLineColor: getLineColor,
    getFillColor: getFilledColor,
    highlightColor: highlightColor,
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

export default geoJsonConfiguration;
