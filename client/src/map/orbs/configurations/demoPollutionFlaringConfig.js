import { DataFilterExtension } from '@deck.gl/extensions';
import { format } from 'date-fns';
import { find } from 'lodash';

import {
  dataSelector,
  otherSelector,
  visibilitySelector,
} from '../layers.slice';

/**
 * @type {import("typings/orbis").LayerConfiguration<{
 *  otherStateKey?: string
 *  dateFormat?: string
 * }>}
 */
const Config = ({
  id,
  orbState,
  activeSources,
  otherStateKey = id,
  dateFormat = 'yyyy-MM',
}) => {
  const visible = visibilitySelector(id)(orbState);
  const other = otherSelector(otherStateKey)(orbState);
  const data = dataSelector(id)(orbState);

  const otherDate = other?.date
    ? format(new Date(other?.date), dateFormat)
    : undefined;

  return {
    id,
    visible: visible && find(activeSources, { source_id: id }),
    data: data?.features,
    getPosition: feature => feature.geometry.coordinates,
    extensions: [new DataFilterExtension({ filterSize: 1 })],
    getFilterValue: feature =>
      otherDate ? Number(feature.properties.timestamp.includes(otherDate)) : 1,
    filterRange: [1, 1],
    updateTriggers: {
      getFilterValue: [other?.date],
    },
  };
};

export default Config;
