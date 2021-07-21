import { useDispatch, useSelector } from 'react-redux';

import { fetchOrbs, orbsSelector } from 'data-layers/data-layers.slice';

/**
 *
 * @param {import('typings/orbis').FeatureKey[]} featureKeysToSearch
 * @param {import('typings/orbis').FeatureKey} featureKeyToFind
 * @returns {boolean}
 */
const hasFeatureKey = (featureKeysToSearch, featureKeyToFind) =>
  featureKeysToSearch.includes(featureKeyToFind);

/**
 * Check whether the current user has access to features provided by an Orb
 * @param {import('typings/orbis').FeatureKey | import('typings/orbis').FeatureKey[]} arg
 * The key or keys of features to check
 * @returns {boolean | Record<import('typings/orbis').FeatureKey, boolean>}
 * If a single key is provided, will return a single boolean if the user has access.
 * If multiple keys are provided, will return an object with a boolean for each key
 */
export const useOrbFeatureAccess = arg => {
  const orbs = useSelector(orbsSelector);
  const dispatch = useDispatch();
  if (orbs == null) {
    dispatch(fetchOrbs());
    return false;
  }
  if (orbs.length === 0) return false;
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
