import { BitmapLayer } from '@deck.gl/layers';

import { dataSelector, visibilitySelector } from '../layers.slice';

/** @type {import("typings/orbis").LayerConfiguration} */
export default ({ id, orbState }) => {
  const data = dataSelector(id)(orbState);
  const visible = visibilitySelector(id)(orbState);

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
