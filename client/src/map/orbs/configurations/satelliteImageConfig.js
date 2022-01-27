import { BitmapLayer } from '@deck.gl/layers';

import { dataSelector, visibilitySelector } from '../layers.slice';

/** @type {import("typings/orbis").LayerConfiguration<{visible?: boolean}>} */
export const baseSatelliteImageConfig = ({ id, data, visible }) => {
  return {
    id,
    data,
    visible,
    tileSize: 256,
    renderSubLayers: props => {
      const {
        bbox: { west, south, east, north },
      } = props.tile;
      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north],
      });
    },
  };
};

/** @type {import("typings/orbis").LayerConfiguration} */
const Config = ({ id, orbState, ...rest }) => {
  const data = dataSelector(id)(orbState);
  const visible = visibilitySelector(id)(orbState);

  return baseSatelliteImageConfig({ id, data, orbState, visible, ...rest });
};

export default Config;
