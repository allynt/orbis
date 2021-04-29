import { groupBy } from 'lodash';
/**
 * @typedef {import("typings/orbis").Property} Property
 */

/**
 * @param {Property[]} properties
 * @returns {(Property | Property[])[]}
 */
export const groupProperties = properties => {
  const group = groupBy(properties, 'property_group');
  return Object.entries(group).reduce(
    (acc, [key, group]) =>
      key === 'undefined' ? [...acc, ...group] : [...acc, group],
    [],
  );
};
