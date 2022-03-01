import { hexToRgbArray } from 'utils/color';
import { getAuthTokenForSource } from 'utils/tokens';

import { dataSelector, visibilitySelector } from '../layers.slice';

export const DEFAULT_LINE_COLOR = '#00ff00';
export const DEFAULT_FILLED_COLOR = '#006400';
export const DEFAULT_HIGHLIGHT_COLOR = '#483D8B';

/** @type {import("typings/orbis").LayerConfiguration} */

/**
 * @param {{
 *   id: string
 *   filledColor: string
 *   outlineColor: string
 *   highlightColor: string
 *   isFilled: boolean
 *   isHighlighted: boolean
 *   isOutlined: boolean
 *   activeSources?: import('typings').Source[]
 *   orbState: import('../orbReducer').OrbState
 *   authTokens?: object
 * }} parameters
 */
const geoJsonConfiguration = ({
  id,
  activeSources,
  authTokens,
  orbState,
  isFilled = true,
  filledColor = DEFAULT_FILLED_COLOR,
  isHighlighted = true,
  highlightColor = DEFAULT_HIGHLIGHT_COLOR,
  isOutlined = true,
  outlineColor = DEFAULT_LINE_COLOR,
  ...rest
}) => {
  const source = activeSources?.find(source => source.source_id === id);
  const data = dataSelector(id)(orbState);
  const visible = visibilitySelector(id)(orbState);

  const authToken = getAuthTokenForSource(authTokens, source);

  const newOutlineColor = hexToRgbArray(outlineColor);
  const newFilledColor = hexToRgbArray(filledColor);
  const newHighlightColor = hexToRgbArray(highlightColor);

  const getFillColor = () => (isFilled ? newFilledColor : null);
  const getLineColor = () => (isOutlined ? newOutlineColor : null);
  const getHighlightColor = () => (isHighlighted ? newHighlightColor : null);

  return {
    id,
    data,
    orbState,
    visible,
    autoHighlight: true,
    filled: isFilled,
    stroked: isOutlined,
    pickable: isHighlighted,
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
