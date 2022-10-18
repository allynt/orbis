// @ts-nocheck
import { isEmpty, cloneDeep } from 'lodash';

const NO_ORB_NAME = 'No Orb';
const PATH_DELIMITER = '.';

/** @typedef {import('typings').Source} Source */
/** @typedef {import('typings').CategoryHierarchy} CategoryHierarchy */
/** @typedef {import('typings').SourceCategories} SourceCategories */
/** @typedef {import('typings').OrbisApplicationMetadata} OrbisApplicationMetadata */
/** @typedef {import('typings').CategorisedSources} CategorisedSources */
/** @typedef {import('typings').OrbWithCategorisedSources} OrbWithCategorisedSources */
/** @typedef {import('typings').Orb} Orb */

/**
 * @param {CategoryHierarchy | Source} a
 * @param {CategoryHierarchy | Source} b
 */
const sortCategories = (a, b) => {
  if (a.category && b.category) return 0;
  if (a.category && !b.category) return -1;
  return 1;
};

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
  if (categories === undefined || isEmpty(categories)) return '';
  let _categories = categories;
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
      sources: newSources.sort(sortCategories),
    };
    return newCategorisedSources;
  }
  return [
    ...categorisedSources,
    createHierarchy(source, [...categoryPath].reverse()),
  ].sort(sortCategories);
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
  if (!categories || isEmpty(categories))
    return {
      ...existingOrb,
      sources: [...existingOrb.sources, source],
    };
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
  if (!categories || isEmpty(categories)) return { ...orb, sources: [source] };
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
 * @param {number} depth
 * @param {boolean} ignoreMultipleOrbs
 * @param {boolean} isCrossFilteringMode
 * @returns {OrbWithCategorisedSources[]}
 */
export const createOrbsWithCategorisedSources = (
  sources,
  depth,
  ignoreMultipleOrbs = false,
  isCrossFilteringMode,
) =>
  sources?.reduce(
    /**
     * @param {OrbWithCategorisedSources[]} categorisedOrbs
     */
    (categorisedOrbs, source) => {
      if ('dashboard_component' in source.metadata.application.orbis) {
        return categorisedOrbs;
      }
      const metadata = orbisMetadataSelector(source);
      let extendedSource = cloneDeep(source);
      if (isCrossFilteringMode) {
        // inject the datalayer name as a new level beneath existing categories
        extendedSource.metadata.application.orbis.categories.child = {
          ...extendedSource.metadata.application.orbis.categories.child,
          child: {
            name: extendedSource.metadata.label,
          },
        };
      }
      let newOrbs = [...categorisedOrbs];
      let orbs = metadata.orbs;
      if (!orbs?.length) orbs = [{ name: NO_ORB_NAME }];
      if (ignoreMultipleOrbs) orbs = [orbs[0]];
      orbs.forEach(orb => {
        const existingOrb = newOrbs.find(o => orb.name === o.name);
        if (existingOrb) {
          const updatedOrb = addSourceToExistingOrb(
            existingOrb,
            extendedSource,
            depth,
          );
          const existingOrbIndex = newOrbs.indexOf(existingOrb);
          newOrbs[existingOrbIndex] = updatedOrb;
          return newOrbs;
        }
        const newOrb = createNewCategorisedOrb(orb, extendedSource, depth);
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
