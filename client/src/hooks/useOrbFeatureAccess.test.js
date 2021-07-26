import React from 'react';

import { renderHook as tlRenderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { useOrbFeatureAccess } from './useOrbFeatureAccess';

/** @type {import('redux-mock-store').MockStoreCreator<import('react-redux').DefaultRootState>} */
const mockStore = createMockStore([thunk]);

/** @type {User["orbs"][]} */
const ORBS = [
  { name: 'Orb A', features: ['feature-b', 'feature-c'] },
  { name: 'Orb B', features: ['feature-a'] },
  { name: 'Orb C' },
];

const renderHook = (arg, defaultOrbs = ORBS) => {
  const store = mockStore({
    accounts: { user: { orbs: defaultOrbs } },
  });
  const utils = tlRenderHook(() => useOrbFeatureAccess(arg), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
  return { ...utils, store };
};

describe('useOrbFeatureAccess', () => {
  it('Returns false if the user does not have the correct orb to grant access', () => {
    const { result } = renderHook('feature-d');
    expect(result.current).toBe(false);
  });

  it('Returns true if the user has the orb for the feature', () => {
    const { result } = renderHook('feature-a');
    expect(result.current).toBe(true);
  });

  it('Returns an object of results if an array of feature ids is passed', () => {
    const { result } = renderHook(['feature-a', 'feature-b', 'feature-d']);
    expect(result.current).toEqual({
      'feature-a': true,
      'feature-b': true,
      'feature-d': false,
    });
  });
});
