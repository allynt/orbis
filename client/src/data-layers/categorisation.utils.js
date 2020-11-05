/**
 * @param {Source} source
 * @param {string[]} categories
 * @returns {import('./data-layers-dialog/layer-select/layer-select.component').OrbSources}
 */
export const createHierarchy = (
  source,
  categories,
  currentHierarchy = null,
) => {
  if (categories.length > 1) {
    const [last, ...remainingCategories] = categories;
    return createHierarchy(source, remainingCategories, [
      { category: last, sources: currentHierarchy || [source] },
    ]);
  }
  return { category: categories[0], sources: currentHierarchy || [source] };
};

/**
 * @param {import('./data-layers-dialog/layer-select/layer-select.component').OrbSources} categorisedSources
 * @param {Source} source
 * @param {string[]} categoryPath
 * @returns {import('./data-layers-dialog/layer-select/layer-select.component').OrbSources}
 */
export const injectSource = (categorisedSources, source, categoryPath) => {
  const existingCategory = categorisedSources.find(
    cat => cat.category === categoryPath[0],
  );
  if (!!existingCategory) {
    let newSources;
    if (categoryPath.length === 1) {
      newSources = existingCategory.sources;
      newSources.push(source);
    } else {
      const [, ...remainingPath] = categoryPath;
      newSources = injectSource(
        existingCategory.sources,
        source,
        remainingPath,
      );
    }
    const existingCategoryIndex = categorisedSources.indexOf(existingCategory);
    let newCategorisedSources = categorisedSources;
    categorisedSources[existingCategoryIndex] = {
      ...existingCategory,
      sources: newSources,
    };
    return newCategorisedSources;
  }
  return [
    ...categorisedSources,
    createHierarchy(source, categoryPath.reverse()),
  ];
};
