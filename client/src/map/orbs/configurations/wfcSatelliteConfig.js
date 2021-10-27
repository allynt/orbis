import { DataFilterExtension } from '@deck.gl/extensions';
import { get } from 'lodash';

import {
  otherSelector,
  timestampSelector,
  dataSelector,
  SHARED_STATE_KEY,
} from '../layers.slice';

export const COLOR_PRIMARY = [246, 190, 0, 255];

const configuration = ({ id, activeSources, orbState, authToken }) => {
  const source = activeSources?.find(source => source.source_id === id);
  const other = otherSelector(SHARED_STATE_KEY)(orbState);
  const data = dataSelector(id)(orbState);
  const selectedProperty = get(other, 'property');
  if (selectedProperty?.source_id !== id) return undefined;

  const propertyStateKey = `${selectedProperty?.source_id}/${selectedProperty?.name}`;
  const selectedTimestamp = timestampSelector(propertyStateKey)(orbState);
  const selectedPropertyMetadata = source?.metadata?.properties?.find(
    property => property.name === selectedProperty.name,
  );

  const getFillColor = feature => COLOR_PRIMARY;

  const getFilterValue = feature =>
    new Date(feature.properties.timestamp).getTime();

  const filterRange = [
    new Date(
      selectedTimestamp ||
        selectedPropertyMetadata?.timeseries_latest_timestamp,
    ),
    new Date(
      selectedTimestamp ||
        selectedPropertyMetadata?.timeseries_latest_timestamp,
    ),
  ].map(timestamp => {
    return timestamp.getTime();
  });

  const config = {
    id,
    data,
    authToken,
    visible: !!source && selectedProperty.source_id === id,
    minZoom: source?.metadata?.minZoom,
    maxZoom: source?.metadata?.maxZoom,
    getLineColor: COLOR_PRIMARY,
    getFillColor,
    extensions: [new DataFilterExtension({ filterSize: 1 })],
    getFilterValue,
    filterRange,
    updateTriggers: {
      getFilterValue: [selectedProperty, selectedTimestamp, filterRange],
    },
  };

  return config;
};

export default configuration;
