import { get } from 'lodash';

/**
 * Returns true if the given filter value is present in the filters object
 *
 * @param {any} object
 * @param {{layer: object, property: object, value: any[]}} item
 */
export const filterValueIsPresent = (object, item) => {
  if (item === undefined || item === null) {
    throw new TypeError('item cannot be null or undefined');
  }
  const { layer, property, value } = item;
  return (
    !!object &&
    !!object[layer] &&
    !!object[layer][property] &&
    object[layer][property].includes(value)
  );
};

/**
 * Returns true if there are any available filters values
 * @param {any} filterObject
 */
export const areAnyFilterValuesPresent = filterObject => {
  for (let layer in filterObject) {
    for (let property in filterObject[layer]) {
      if (filterObject[layer][property].length > 0) return true;
    }
  }
  return false;
};

/**
 * Returns an object with the filter path as a key and array of unique values for the given filter path
 * @param {string} filter
 * @param {object[]} filterableCollection
 */
const getNonGroupOptions = (filter, filterableCollection) => ({
  [filter]: Array.from(
    filterableCollection.reduce((options, val) => {
      const value = get(val, filter);
      if (value) {
        if (Array.isArray(value)) value.forEach(val => options.add(val));
        else options.add(value);
      }
      return options;
    }, new Set()),
  ),
});

/**
 * Returns an object with filter paths as keys and arrays of unique filterable values.
 * If the given filter path points to an object, will include any properties of that object as paths
 * @param {string} filter
 * @param {object[]} filterableCollection
 */
export const getFilterOptions = (filter, filterableCollection) =>
  filterableCollection.reduce((acc, obj) => {
    const value = get(obj, filter);
    if (value) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const properties = Object.keys(value);
        for (let property of properties) {
          acc = {
            ...acc,
            ...getFilterOptions(`${filter}.${property}`, filterableCollection),
          };
        }
        return acc;
      }
      return { ...acc, ...getNonGroupOptions(filter, filterableCollection) };
    }
    return acc;
  }, {});
