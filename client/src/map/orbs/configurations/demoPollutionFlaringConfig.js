import { format } from 'date-fns';
import { filter, find } from 'lodash';
import { layersVisibilitySelector, otherSelector } from '../orbReducer';

/** @type {import("typings/orbis").LayerConfiguration<{otherStateKey?: string}>} */
export default ({ id, data, orbState, activeSources, otherStateKey = id }) => {
  const visible = layersVisibilitySelector(id)(orbState);
  const other = otherSelector(otherStateKey)(orbState);

  const otherDate = new Date(other?.date);

  return {
    id,
    visible: visible && find(activeSources, { source_id: id }),
    data: other?.date
      ? filter(data.features, feature =>
          feature.properties.timestamp.includes(format(otherDate, 'yyyy-MM')),
        )
      : data?.features,
    getPosition: d => d.geometry.coordinates,
  };
};
