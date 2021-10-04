import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';

import { dataSelector, visibilitySelector } from '../layers.slice';

/** @type {import("typings/orbis").LayerConfiguration<{visible?: boolean}>} */
export const baseSatelliteImageConfig = ({
  id,
  data,
  visible,
  minZoom,
  maxZoom,
  authToken,
}) => {
  return {
    id,
    data,
    visible,
    tileSize: 256,
    minZoom,
    maxZoom,
    renderSubLayers: props => {
      const {
        bbox: { west, south, east, north },
      } = props.tile;
      return new BitmapLayer(props, {
        // return new TileLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north],
      });
    },
    loadOptions: {
      fetch: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    },
  };
};

/** @type {import("typings/orbis").LayerConfiguration} */
export default ({ id, activeSources, orbState, authToken, ...rest }) => {
  const source = activeSources?.find(source => source.source_id === id);
  const data = dataSelector(id)(orbState);
  const visible = visibilitySelector(id)(orbState);

  return baseSatelliteImageConfig({
    id,
    data,
    orbState,
    visible,
    minZoom: source?.metadata?.minZoom,
    maxZoom: source?.metadata?.maxZoom,
    authToken,
    ...rest,
  });
};
