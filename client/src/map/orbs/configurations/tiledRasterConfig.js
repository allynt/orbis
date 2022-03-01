import { BitmapLayer } from '@deck.gl/layers';

import { getAuthTokenForSource } from 'utils/tokens';

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
const Config = ({ id, activeSources, orbState, authTokens, ...rest }) => {
  const source = activeSources?.find(source => source.source_id === id);
  const data = dataSelector(id)(orbState);
  const visible = visibilitySelector(id)(orbState);
  const authToken = getAuthTokenForSource(authTokens, source);

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

export default Config;
