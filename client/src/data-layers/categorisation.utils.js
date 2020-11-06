const OTHER_CATEGORY_NAME = 'Other';
const NO_ORB_NAME = 'No Orb';

/**
 * @param {SourceCategories} category
 * @param {string} currentPath
 * @returns {string}
 */
const createPath = (category = { name: OTHER_CATEGORY_NAME }, currentPath) => {
  if (category.child)
    return createPath(
      category.child,
      currentPath ? `${currentPath}.${category.name}` : category.name,
    );
  return `${currentPath}.${category.name}`;
};

/**
 * Helper function to get the orbis application object from source metadata
 * @param {Source} source
 * @returns {Partial<OrbisApplicationMetadata>}
 */
const orbisMetadataSelector = source =>
  source?.metadata?.application?.orbis || {};

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
  const { categories } = orbisMetadataSelector(source);
  const categorisationPath = createPath(categories, existingOrb.name);
  const [, ...categoriesPath] = categorisationPath.split('.');
  const injectedSources = injectSource(
    existingOrb.sources,
    source,
    categoriesPath,
  );
  return {
    ...existingOrb,
    sources: injectedSources,
  };
};

const createNewCategorisedOrb = (orb, source) => {
  const { categories } = orbisMetadataSelector(source);
  const categorisationPath = createPath(categories, orb.name);
  const [, ...categoriesPath] = categorisationPath.split('.');
  const sources = [createHierarchy(source, categoriesPath.reverse())];
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
     * @param {import('./data-layers-dialog/data-layers-dialog.component').Orb[]} categorisedOrbs
     */
    (categorisedOrbs, source) => {
      const { orbs = [{ name: NO_ORB_NAME }] } = orbisMetadataSelector(source);
      let newOrbs = [...categorisedOrbs];
      orbs.forEach(orb => {
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
