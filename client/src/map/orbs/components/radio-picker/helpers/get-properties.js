export const getProperties = selectedLayer => {
  const properties = selectedLayer?.metadata?.properties;

  return properties.reduce((acc, cur) => {
    if (!acc.flat().includes(cur)) {
      if (!cur.property_group) return [...acc, cur];

      const twinIndex = properties.findIndex(
        p => p.property_group === cur.property_group && p.type !== cur.type,
      );

      if (twinIndex !== -1) {
        const twin = properties[twinIndex];
        return [...acc, [cur, twin]];
      }
    }
    return acc;
  }, []);
};
