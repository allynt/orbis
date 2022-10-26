export const getGeometryType = (geometryTypes, geometryTypesHierarchy) => {
  let result = null;
  geometryTypes.forEach(element => {
    if (!geometryTypesHierarchy[element]) {
      throw new Error(`invalidGeometryType ${element}`);
    }
    if (
      !result ||
      geometryTypesHierarchy[element] < geometryTypesHierarchy[result]
    ) {
      result = element;
    }
  });
  return result;
};

export const groupPropertiesAndSourceIds = (properties, dataSources) =>
  properties.reduce((acc, property) => {
    const propertyParentSourceId = dataSources?.find(
      source => !!source.properties.find(p => p.label === property.label),
    ).source_id;
    if (!propertyParentSourceId) return acc;
    return {
      ...acc,
      [propertyParentSourceId]: [
        ...(acc[propertyParentSourceId] ?? []),
        property,
      ],
    };
  }, {});
