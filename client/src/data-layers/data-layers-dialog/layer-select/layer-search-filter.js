const SEARCHABLE_FIELDS = ['label', 'description'];

export const layerSearchFilter = (orbs, searchTerm) => {
  const regex = new RegExp(searchTerm.trim(), 'i'),
    filteredSources = orbs?.reduce((acc, source) => {
      let result = acc;
      SEARCHABLE_FIELDS.forEach(term => {
        if (source.metadata[term].match(regex)) {
          result = [...acc, source];
          return;
        }
      });
      return result;
    }, []);

  return filteredSources?.sources || [];
};
