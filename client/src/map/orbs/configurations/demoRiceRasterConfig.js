import { find } from 'lodash';

export default ({ id, data, activeSources, authToken }) => {
  const defaultColumn = 'ndvi';
  const defaultDate = '20200725';
  const source = activeSources.find(s => s.source_id === id);
  return {
    id,
    image: `${data}/${defaultColumn}_${defaultDate}.png`,
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
