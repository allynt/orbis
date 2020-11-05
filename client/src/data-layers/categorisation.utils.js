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
  return [{ category: categories[0], sources: currentHierarchy || [source] }];
};

/**
 * @param {import('./data-layers-dialog/layer-select/layer-select.component').OrbSources} categorisedSources
 * @param {Source} source
 * @param {string[]} categoryPath
 * @returns {import('./data-layers-dialog/layer-select/layer-select.component').OrbSources}
 */
export const injectSource = (categorisedSources, source, categoryPath) => {
  const existingCategory = categorisedSources.find(
    category => category.category === categoryPath[0],
  );
  if (existingCategory) {
    if (categoryPath.length === 1) {
      return [
        { ...existingCategory, sources: [...existingCategory.sources, source] },
      ];
    }
    const [, ...remainingPath] = categoryPath;
    let existingSources = existingCategory.sources;
    const index = existingSources.findIndex(
      src => src.category === remainingPath[0],
    );
    if (index >= 0) {
      existingSources[index] = injectSource(
        existingCategory.sources,
        source,
        remainingPath,
      )[0];
      return [
        {
          ...existingCategory,
          sources: existingSources,
        },
      ];
    }
    return [
      {
        ...existingCategory,
        sources: [
          ...existingSources,
          ...createHierarchy(source, remainingPath.reverse()),
        ],
      },
    ];
  }
  return [...categorisedSources, ...createHierarchy(source, categoryPath)];
};
