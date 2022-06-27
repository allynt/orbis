import { BitmapLayer } from '@deck.gl/layers';
import { format } from 'date-fns';

import {
  dataSelector,
  visibilitySelector,
  otherSelector,
} from '../layers.slice';

/** @type {import("typings/orbis").LayerConfiguration<{visible?: boolean}>} */
export const timeseriesImageConfig = ({
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
const Config = ({
  id,
  activeSources,
  orbState,
  otherStateKey = id,
  defaultValue,
  valueKey,
  authToken,
  dateFormat = 'yyyyMMddHHmmss',
  defaultDate,
  ...rest
}) => {
  const source = activeSources?.find(source => source.source_id === id);
  const data = dataSelector(id)(orbState);
  const visible = visibilitySelector(id)(orbState);
  const other = otherSelector(otherStateKey)(orbState);

  const timestamp = other?.date
    ? format(new Date(other?.date), dateFormat)
    : defaultDate;
  const url = `${data}/${defaultValue}${timestamp}/{z}/{x}/{-y}.png`;

  return timeseriesImageConfig({
    id,
    data: url,
    orbState,
    visible,
    minZoom: source?.metadata?.minZoom,
    maxZoom: source?.metadata?.maxZoom,
    authToken,
    ...rest,
  });
};

export default Config;
