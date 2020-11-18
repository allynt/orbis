export const getProperties = selectedLayer => {
  const properties = selectedLayer?.metadata?.properties;

  const sortedProperties = properties.reduce((acc, cur) => {
    if (!acc.flat().includes(cur)) {
      const twinIndex = properties.findIndex(
        p => p.property_group === cur.property_group && p.type !== cur.type,
      );

      if (twinIndex !== -1) {
        const twin = properties[twinIndex];
        return [...acc, [cur, twin]];
      } else {
        return [...acc, cur];
      }
    }
    return acc;
  }, []);

  return sortedProperties;
};
