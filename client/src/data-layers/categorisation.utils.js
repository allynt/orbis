import { Categories } from './data-layers-dialog/layer-select/layer-select.stories';

const OTHER_CATEGORY_NAME = 'Other';
const NO_ORB_NAME = 'No Orb';
const PATH_DELIMITER = '.';

/**
 * Recursively creates a . delimited categorisation path from a source's categories
 * @param {{
 *  categories: SourceCategories
 *  currentPath?: string
 *  depth?: number
 * }} params
 * @returns {string} The complete categorisation path
 */
export const createCategorisationPath = ({
  categories,
  currentPath = undefined,
  depth = undefined,
}) => {
  let _categories = categories;
  if (!_categories?.name) _categories = { name: OTHER_CATEGORY_NAME };
  if (_categories.child && (depth > 1 || depth === undefined))
    return createCategorisationPath({
      categories: _categories.child,
      currentPath: currentPath
        ? `${currentPath}${PATH_DELIMITER}${_categories.name}`
        : _categories.name,
      depth: depth && depth - 1,
    });
  return `${currentPath ? `${currentPath}${PATH_DELIMITER}` : ''}${
    _categories.name
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
 * Creates a brand new category hierarchy with a single source
 * @param {Source} source
 * @param {string[]} categories
 * @param {CategoryHierarchy} [currentHierarchy]
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
 * Performs the injection of a source into a category hierarchy
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
    createHierarchy(source, [...categoryPath].reverse()),
  ];
};

/**
 * Injects a source into an already existing orb's category hierarchy
 * @param {OrbWithCategorisedSources} existingOrb
 * @param {Source} source
 * @param {number} [depth]
 * @returns {OrbWithCategorisedSources}
 */
const addSourceToExistingOrb = (existingOrb, source, depth) => {
  const { categories } = orbisMetadataSelector(source);
  const categorisationPath = createCategorisationPath({
    categories,
    currentPath: existingOrb.name,
    depth,
  });
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
 * Creates a new orb with its sources organised by category
 * @param {Orb} orb
 * @param {Source} source
 * @param {number} [depth]
 * @returns {OrbWithCategorisedSources}
 */
const createNewCategorisedOrb = (orb, source, depth) => {
  const { categories } = orbisMetadataSelector(source);
  const categorisationPath = createCategorisationPath({
    categories,
    currentPath: orb.name,
    depth,
  });
  const [, ...categoriesPath] = categorisationPath.split(PATH_DELIMITER);
  const sources = [createHierarchy(source, categoriesPath.reverse())];
  return {
    ...orb,
    sources,
  };
};

/**
 * Creates an array of orbs with their sources organised by category
 * @param {Source[]} sources
 * @param {number} [depth]
 * @returns {OrbWithCategorisedSources[]}
 */
export const createOrbsWithCategorisedSources = (sources, depth) =>
  sources.reduce(
    /**
     * @param {OrbWithCategorisedSources[]} categorisedOrbs
     */
    (categorisedOrbs, source) => {
      const metadata = orbisMetadataSelector(source);
      let newOrbs = [...categorisedOrbs];
      let orbs = metadata.orbs;
      if (!orbs?.length) orbs = [{ name: NO_ORB_NAME }];
      orbs.forEach(orb => {
        const existingOrb = newOrbs.find(o => orb.name === o.name);
        if (existingOrb) {
          const updatedOrb = addSourceToExistingOrb(existingOrb, source, depth);
          const existingOrbIndex = newOrbs.indexOf(existingOrb);
          newOrbs[existingOrbIndex] = updatedOrb;
          return newOrbs;
        }
        const newOrb = createNewCategorisedOrb(orb, source, depth);
        newOrbs = [...newOrbs, newOrb];
      });

      return newOrbs;
    },
    [],
  );

/**
 * @param {CategorisedSources} categorisedSources
 * @returns {Source['source_id'][]}
 */
export const collectSourceIds = categorisedSources =>
  categorisedSources.reduce((acc, sourceOrCategory) => {
    if (sourceOrCategory.source_id) return [...acc, sourceOrCategory.source_id];
    return [...acc, ...collectSourceIds(sourceOrCategory.sources)];
  }, []);
