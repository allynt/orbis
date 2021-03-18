import { format } from 'date-fns';
import { find } from 'lodash';
import { layersVisibilitySelector, otherSelector } from '../orbReducer';

/** @type {import('typings/orbis').LayerConfiguration} */
export default ({ id, data, activeSources, authToken, orbState }) => {
  const defaultColumn = 'rgb';
  const defaultDate = '20200312';
  const source = activeSources.find(s => s.source_id === id);
  const other = otherSelector(`${source.authority}/${source.namespace}/*/*`)(
    orbState,
  );
  const visible = layersVisibilitySelector(id)(orbState);
  return {
    id,
    visible,
    image: `${data}/${other?.column ? other.column : defaultColumn}_${
      other?.date ? format(new Date(other.date), 'yyyyMMdd') : defaultDate
    }.png`,
    bounds: find(source.metadata.properties, { name: defaultColumn }).bounds,
    loadOptions: {
      fetch: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    },
  };
};
