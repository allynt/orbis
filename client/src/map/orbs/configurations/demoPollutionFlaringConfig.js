import { format, subHours } from 'date-fns';
import { filter, find } from 'lodash';
import { layersVisibilitySelector, otherSelector } from '../orbReducer';

/** @type {import("typings/orbis").LayerConfiguration} */
export default ({ id, data, orbState, activeSources }) => {
  const visible = layersVisibilitySelector(id)(orbState);
  const other = otherSelector(id)(orbState);

  return {
    id,
    visible: visible && find(activeSources, { source_id: id }),
    data: other?.date
      ? filter(data.features, {
          properties: {
            timestamp: format(
              subHours(new Date(other.date), 1),
              'yyyy-MM-dd HH:mm:ss',
            ),
          },
        })
      : data?.features,
    getPosition: d => d.geometry.coordinates,
  };
};
