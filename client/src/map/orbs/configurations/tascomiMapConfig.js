import { dataSelector } from '../layers.slice';

const PIN_COLOR = [255, 254, 25, 255];

/**
 * @typedef {import('typings').GeoJsonFeature<{type?: string, Type?: string}>} ActionForHelpFeature
 */

const configuration = ({ id, orbState }) => {
  const data = dataSelector(id)(orbState);

  const getPinColor = feature => PIN_COLOR;

  return {
    id,
    data,
    visible: true,
    pointType: 'icon',
    getPinColor,
  };
};

export default configuration;
