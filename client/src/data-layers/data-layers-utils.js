export const getGeometryType = (geometryTypes, geometryTypesHierarchy) => {
  let result = null;
  geometryTypes.forEach(element => {
    if (!geometryTypesHierarchy[element]) {
      throw new Error(`invalidGeometryType ${element}`);
    }
    if (
      !result ||
      geometryTypesHierarchy[element].order <
        geometryTypesHierarchy[result].order
    ) {
      result = element;
    }
  });
  return result;
};

export const groupPropertiesAndSourceIds = (properties, dataSources) =>
  properties.reduce((acc, property) => {
    const propertyParentSourceId = dataSources?.find(
      source =>
        !!source.metadata.properties.find(p => p.name === property.name),
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
