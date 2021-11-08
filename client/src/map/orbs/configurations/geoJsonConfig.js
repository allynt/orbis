import { hexToRgbArray } from 'utils/color';

import { dataSelector, visibilitySelector } from '../layers.slice';

export const DEFAULT_LINE_COLOR = '#00ff00';
export const DEFAULT_FILLED_COLOR = '#006400';
export const DEFAULT_HIGHLIGHT_COLOR = '#483D8B';

/** @type {import("typings/orbis").LayerConfiguration} */

/**
 * @param {{
 *   id: string
 *   stroked: boolean
 *   filled: boolean
 *   pickable: boolean
 *   lineColor: string
 *   filledColor: string
 *   highlightColor: string
 *   activeSources?: import('typings').Source[]
 *   orbState: import('../orbReducer').OrbState
 *   authToken?: string
 * }} parameters
 */
const geoJsonConfiguration = ({
  id,
  authToken,
  orbState,
  filled = true,
  stroked = true,
  pickable = true,
  lineColor = DEFAULT_LINE_COLOR,
  filledColor = DEFAULT_FILLED_COLOR,
  highlightColor = DEFAULT_HIGHLIGHT_COLOR,
  ...rest
}) => {
  const data = dataSelector(id)(orbState);
  const visible = visibilitySelector(id)(orbState);

  const newLineColor = hexToRgbArray(lineColor);
  const newFilledColor = hexToRgbArray(filledColor);
  const newHighLightColor = hexToRgbArray(highlightColor);

  const getFillColor = () => (filled ? newFilledColor : null);
  const getLineColor = () => (stroked ? newLineColor : null);
  const getHighlightColor = () => (pickable ? newHighLightColor : null);

  return {
    id,
    data,
    orbState,
    visible,
    pickable,
    autoHighlight: true,
    filled,
    stroked,
    getLineWidth: 4,
    lineWidthMinPixels: 1,
    getLineColor,
    getFillColor,
    highlightColor: getHighlightColor,
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
