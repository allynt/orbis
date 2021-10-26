import { GeoJsonLayer } from '@deck.gl/layers';

import { hexToRgbArray } from 'utils/color';

import { dataSelector, visibilitySelector } from '../layers.slice';

export const DEFAULT_LINE_COLOR = '#00ff00';
export const DEFAULT_FILLED_COLOR = '#006400';
export const DEFAULT_HIGHLIGHT_COLOR = '#483D8B';
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

  /* a layer can be filled or not-filled */
  function getFilledColor() {
    if (filled || filled === undefined) {
      return filledColor;
    } else {
      return FILLED_TRANSPARENT_COLOR;
    }
  }

  lineColor = lineColor
    ? hexToRgbArray(lineColor)
    : hexToRgbArray(DEFAULT_LINE_COLOR);

  filledColor = filledColor
    ? hexToRgbArray(filledColor)
    : hexToRgbArray(DEFAULT_FILLED_COLOR);

  highlightColor = highlightColor
    ? hexToRgbArray(highlightColor)
    : hexToRgbArray(DEFAULT_HIGHLIGHT_COLOR);

  function getLineColor() {
    if (stroked || stroked === undefined || (!stroked && !filled)) {
      return lineColor;
    }
  }
  return {
    id,
    data,
    orbState,
    visible,
    pickable: true,
    autoHighlight: true,
    filled: true,
    stroked: true,
    getLineWidth: 4,
    lineWidthMinPixels: 1,
    getLineColor: getLineColor,
    getFillColor: getFilledColor,
    highlightColor: highlightColor,
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
