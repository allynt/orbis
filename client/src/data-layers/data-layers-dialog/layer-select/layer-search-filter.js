const SEARCHABLE_FIELDS = ['label', 'description'];

export const layerSearchFilter = (orbs, searchTerm) => {
  if (!searchTerm) return;
  const processedTerm = searchTerm?.toLowerCase().trim(),
    filteredSources = orbs?.reduce((acc, source) => {
      let result = acc;
      SEARCHABLE_FIELDS.forEach(field => {
        if (source.metadata[field]?.toLowerCase().includes(processedTerm)) {
          result = [...acc, source];
          return;
        }
      });
      return result;
    }, []);

  return filteredSources;
};
