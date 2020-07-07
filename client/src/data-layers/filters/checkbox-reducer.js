import { get, merge } from 'lodash';

const addItem = (state, set, { layer, property, value }) => {
  const current = get(state, `${set}.${layer}.${property}`, []);
  return merge(
    { [set]: { [layer]: { [property]: [...current, value] } } },
    state,
  );
};

const removeItem = (state, set, { layer, property, value }) => {
  const current = get(state, `${set}.${layer}.${property}`);
  const index = current.indexOf(value);
  current.splice(index, 1);
  return merge({ [set]: { [layer]: { [property]: current } } }, state);
};

export const checkboxReducer = (state, action) => {
  switch (action.type) {
    case 'add/toAdd':
      return addItem(state, 'toAdd', action.item);
    case 'remove/toAdd':
      return removeItem(state, 'toAdd', action.item);
    case 'add/toRemove':
      return addItem(state, 'toRemove', action.item);
    case 'remove/toRemove':
      return removeItem(state, 'toRemove', action.item);
    default:
      return state;
  }
};
