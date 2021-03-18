import { format } from 'date-fns';
import { find } from 'lodash';
import { layersVisibilitySelector, otherSelector } from '../orbReducer';

const DEFAULT_GAS = 'no2',
  DEFAULT_DATE = new Date(2020, 5).getTime();

/** @type {import('typings/orbis').LayerConfiguration} */
export default ({ id, data, authToken, orbState, activeSources }) => {
  const source = find(activeSources, { source_id: id });
  const visible = layersVisibilitySelector(id)(orbState);
  const other = otherSelector(`astrosat/demo/air_pollution/*`)(orbState);

  return {
    id,
    visible,
    image: `${data}/${other?.gas || DEFAULT_GAS}_${format(
      new Date(other?.date || DEFAULT_DATE),
      'yyyyMM',
    )}.png`,
    bounds: find(source.metadata.properties, {
      name: other?.gas || DEFAULT_GAS,
    }).bounds,
    loadOptions: {
      fetch: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    },
  };
};
