/**
 * @param {Category} category
 * @param {string} currentPath
 * @returns {string}
 */
const createPath = (category, currentPath) => {
  if (category.child)
    return createPath(
      category.child,
      currentPath ? `${currentPath}.${category.name}` : category.name,
    );
  return `${currentPath}.${category.name}`;
};

/**
 * @param {Source} source
 */
const orbisMetadataSelector = source => source?.metadata?.application?.orbis;

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
      newSources = [...existingCategory.sources];
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
    let newCategorisedSources = [...categorisedSources];
    newCategorisedSources[existingCategoryIndex] = {
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

const addSourceToExistingOrb = (existingOrb, source) => {
  const categorisationPath = createPath(
    source.metadata.application.orbis.categories,
    existingOrb.name,
  );
  const [, ...categories] = categorisationPath.split('.');
  const injectedSources = injectSource(existingOrb.sources, source, categories);
  return {
    ...existingOrb,
    sources: injectedSources,
  };
};

const createNewCategorisedOrb = (orb, source) => {
  const categorisationPath = createPath(
    source.metadata.application.orbis.categories,
    orb.name,
  );
  const [, ...categories] = categorisationPath.split('.');
  const sources = [createHierarchy(source, categories.reverse())];
  return {
    ...orb,
    sources,
  };
};

/**
 * @param {Source[]} sources
 * @returns {import('./data-layers-dialog/data-layers-dialog.component').Orb[]}
 */
export const createCategorisedSources = sources =>
  sources.reduce(
    /**
     * @param {import('./data-layers-dialog/data-layers-dialog.component').Orb[]} orbs
     */
    (orbs, source) => {
      const applicationMetadata = orbisMetadataSelector(source);
      let newOrbs = [...orbs];
      applicationMetadata.orbs.forEach(orb => {
        const existingOrb = newOrbs.find(o => orb.name === o.name);
        if (existingOrb) {
          const updatedOrb = addSourceToExistingOrb(existingOrb, source);
          const existingOrbIndex = newOrbs.indexOf(existingOrb);
          newOrbs[existingOrbIndex] = updatedOrb;
          return newOrbs;
        }
        const newOrb = createNewCategorisedOrb(orb, source);
        newOrbs = [...newOrbs, newOrb];
      });

      return newOrbs;
    },
    [],
  );
