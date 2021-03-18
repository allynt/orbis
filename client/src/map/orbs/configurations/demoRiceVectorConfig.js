/** @type {import("typings/orbis").LayerConfiguration} */
export default ({ id, data, orbState }) => {
  return {
    id,
    data,
    getFillColor: [255, 255, 255, 255],
  };
};
