import { find } from 'lodash';

import { getAuthTokenForSource } from 'utils/tokens';

import { dataSelector, visibilitySelector } from '../layers.slice';

/**
 * @type {import('typings').LayerConfiguration}
 */
const Config = ({ id, activeSources, authTokens, orbState, propertyName }) => {
  const source = find(activeSources, { source_id: id });
  const visible = visibilitySelector(id)(orbState);
  const data = dataSelector(id)(orbState);
  const authToken = getAuthTokenForSource(authTokens, source);

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

export default Config;
