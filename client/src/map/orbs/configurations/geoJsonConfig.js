import { hexToRgbArray } from 'utils/color';

import { dataSelector, visibilitySelector } from '../layers.slice';

export const DEFAULT_LINE_COLOR = '#00ff00';
export const DEFAULT_FILLED_COLOR = '#006400';
export const DEFAULT_HIGHLIGHT_COLOR = '#483D8B';

/** @type {import("typings/orbis").LayerConfiguration} */

/**
 * @param {{
 *   id: string
 *   filled: string
 *   outlined: string
 *   highlighted: string
 *   isFilled: boolean
 *   isHighlighted: boolean
 *   isOutlined: boolean
 *   activeSources?: import('typings').Source[]
 *   orbState: import('../orbReducer').OrbState
 *   authToken?: string
 * }} parameters
 */
const geoJsonConfiguration = ({
  id,
  authToken,
  orbState,
  isFilled = true,
  isOutlined = true,
  isHighlighted = true,
  filled = DEFAULT_LINE_COLOR,
  outlined = DEFAULT_FILLED_COLOR,
  highlighted = DEFAULT_HIGHLIGHT_COLOR,
  ...rest
}) => {
  const data = dataSelector(id)(orbState);
  const visible = visibilitySelector(id)(orbState);

  const newLineColor = hexToRgbArray(outlined);
  const newFilledColor = hexToRgbArray(filled);
  const newHighLightColor = hexToRgbArray(highlighted);

  const getFillColor = () => (isFilled ? newFilledColor : null);
  const getLineColor = () => (isOutlined ? newLineColor : null);
  const getHighlightColor = () => (isHighlighted ? newHighLightColor : null);

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
