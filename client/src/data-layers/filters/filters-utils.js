export const filterValueIsPresent = (object, item) => {
  if (item === undefined || item === null) {
    throw new TypeError('item cannot be null or undefined');
  }
  const { layer, property, value } = item;
  return !!object && !!object[layer] && !!object[layer][property] && object[layer][property].includes(value);
};

export const areAnyFilterValuesPresent = filterObject => {
  for (let layer in filterObject) {
    for (let property in filterObject[layer]) {
      if (filterObject[layer][property].length > 0) return true;
    }
  }
  return false;
};
