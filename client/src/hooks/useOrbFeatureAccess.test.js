import React from 'react';

import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';

import { useOrbFeatureAccess } from './useOrbFeatureAccess';

/** @type {import('redux-mock-store').MockStoreCreator<import('react-redux').DefaultRootState>} */
const mockStore = createMockStore();

/** @type {import('typings/orbis').Orb[]} */
const ORBS = [
  { name: 'Orb A', features: ['feature-b', 'feature-c'] },
  { name: 'Orb B', features: ['feature-a'] },
  { name: 'Orb C' },
];

describe.only('useOrbFeatureAccess', () => {
  it("Returns false if there's no orbs", () => {
    const store = mockStore({
      data: { orbs: undefined },
    });
    const { result } = renderHook(() => useOrbFeatureAccess('feature-a'), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    expect(result.current).toBe(false);
  });

  it('Returns false if the user does not have the correct orb to grant access', () => {
    const store = mockStore({
      data: { orbs: ORBS },
    });
    const { result } = renderHook(() => useOrbFeatureAccess('feature-d'), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    expect(result.current).toBe(false);
  });

  it('Returns true if the user has the orb for the feature', () => {
    const store = mockStore({
      data: { orbs: ORBS },
    });
    const { result } = renderHook(() => useOrbFeatureAccess('feature-a'), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    expect(result.current).toBe(true);
  });

  it('Returns an object of results if an array of feature ids is passed', () => {
    const store = mockStore({
      data: { orbs: ORBS },
    });
    const { result } = renderHook(
      () => useOrbFeatureAccess(['feature-a', 'feature-b', 'feature-d']),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      },
    );
    expect(result.current).toEqual({
      'feature-a': true,
      'feature-b': true,
      'feature-d': false,
    });
  });
});
