const OTHER_CATEGORY_NAME = 'Other';
const NO_ORB_NAME = 'No Orb';
const PATH_DELIMITER = '.';

/**
 * Recursively creates a . delimited categorisation path from a source's categories
 * @param {SourceCategories} categories The category hierarchy to create the path from
 * @param {string} [currentPath] The current path to build onto
 * @returns {string} The complete categorisation path
 */
export const createCategorisationPath = (
  categories = { name: OTHER_CATEGORY_NAME },
  currentPath,
) => {
  if (categories.child)
    return createCategorisationPath(
      categories.child,
      currentPath
        ? `${currentPath}${PATH_DELIMITER}${categories.name}`
        : categories.name,
    );
  return `${currentPath ? `${currentPath}${PATH_DELIMITER}` : ''}${
    categories.name
  }`;
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
 * @returns {CategoryHierarchy}
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
 * @param {CategorisedSources} categorisedSources
 * @param {Source} source
 * @param {string[]} categoryPath
 * @returns {CategorisedSources}
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

/**
 * @param {OrbWithCategorisedSources} existingOrb
 * @param {Source} source
 * @returns {OrbWithCategorisedSources}
 */
const addSourceToExistingOrb = (existingOrb, source) => {
  const { categories } = orbisMetadataSelector(source);
  const categorisationPath = createCategorisationPath(
    categories,
    existingOrb.name,
  );
  const [, ...categoriesPath] = categorisationPath.split(PATH_DELIMITER);
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

/**
 * @param {Orb} orb
 * @param {Source} source
 * @returns {OrbWithCategorisedSources}
 */
const createNewCategorisedOrb = (orb, source) => {
  const { categories } = orbisMetadataSelector(source);
  const categorisationPath = createCategorisationPath(categories, orb.name);
  const [, ...categoriesPath] = categorisationPath.split(PATH_DELIMITER);
  const sources = [createHierarchy(source, categoriesPath.reverse())];
  return {
    ...orb,
    sources,
  };
};

/**
 * @param {Source[]} sources
 * @returns {OrbWithCategorisedSources[]}
 */
export const createOrbsWithCategorisedSources = sources =>
  sources.reduce(
    /**
     * @param {OrbWithCategorisedSources[]} categorisedOrbs
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
