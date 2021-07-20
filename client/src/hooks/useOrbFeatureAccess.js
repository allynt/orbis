import { useSelector } from 'react-redux';

/**
 *
 * @param {import('typings/orbis').FeatureKey[]} featureKeysToSearch
 * @param {import('typings/orbis').FeatureKey} featureKeyToFind
 * @returns {boolean}
 */
const hasFeatureKey = (featureKeysToSearch, featureKeyToFind) =>
  featureKeysToSearch.includes(featureKeyToFind);

/**
 * @param {import('typings/orbis').FeatureKey | import('typings/orbis').FeatureKey[]} arg
 * @returns {boolean | Record<import('typings/orbis').FeatureKey, boolean>}
 */
export const useOrbFeatureAccess = arg => {
  /** @type {import('typings/orbis').Orb[]} */
  const orbs = useSelector(state => state?.data?.orbs);
  if (orbs == null || orbs.length === 0) return false;
  const orbFeatures = orbs.flatMap(orb => orb.features);
  if (Array.isArray(arg)) {
    return arg.reduce(
      (acc, featureKey) => ({
        ...acc,
        [featureKey]: hasFeatureKey(orbFeatures, featureKey),
      }),
      {},
    );
  }
  return hasFeatureKey(orbFeatures, arg);
};
