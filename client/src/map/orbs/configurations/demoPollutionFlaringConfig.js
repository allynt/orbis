import { layersVisibilitySelector } from '../orbReducer';

/** @type {import("typings/orbis").LayerConfiguration} */
export default ({ id, data, orbState }) => {
  const visible = layersVisibilitySelector(id)(orbState);
  console.log(data);
  return {
    id,
    visible,
    data: data?.features,
    getPosition: d => d.geometry.coordinates,
  };
};
