/** @type {import("typings/orbis").LayerConfiguration} */
export default ({ id, data }) => {
  return {
    id,
    data:
      'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/screen-grid/uber-pickup-locations.json',
    getPosition: d => [d[0], d[1]],
  };
};
