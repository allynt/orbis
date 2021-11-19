import { find } from 'lodash';

import { dataSelector, visibilitySelector } from '../layers.slice';

/**
 * @type {import('typings').LayerConfiguration}
 */
export default ({ id, activeSources, authToken, orbState, propertyName }) => {
  const source = find(activeSources, { source_id: id });
  const visible = visibilitySelector(id)(orbState);
  const data = dataSelector(id)(orbState);

  return {
    id,
    visible: visible && !!source,
    image: data,
    bounds:
      source.metadata.bounds ||
      find(source.metadata.properties, { name: propertyName })?.bounds,
    loadOptions: {
      fetch: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    },
  };
};
