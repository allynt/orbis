/**
 * @typedef {import("typings/orbis").Property} Property
 */

/**
 * @param {Property[]} properties
 * @returns {(Property | Property[])[]}
 */
export const groupProperties = properties => {
  return properties.reduce((acc, cur) => {
    if (!acc.flat().includes(cur)) {
      if (!cur.property_group) return [...acc, [cur]];

      const group = properties.filter(
        p => p.property_group === cur.property_group,
      );
      return [...acc, group];
    }
    return acc;
  }, []);
};
