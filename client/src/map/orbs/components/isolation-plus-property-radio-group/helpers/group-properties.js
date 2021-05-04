import { groupBy } from 'lodash';
/**
 * @typedef {import("typings/orbis").Property} Property
 */

/**
 * @param {Property[]} properties
 * @returns {Property[][]}
 */
export const groupProperties = properties => {
  const groupedProperties = groupBy(properties, 'property_group');
  return Object.entries(groupedProperties).reduce(
    (acc, [key, group]) =>
      key === 'undefined' ? [...acc, ...group.map(p => [p])] : [...acc, group],
    [],
  );
};
