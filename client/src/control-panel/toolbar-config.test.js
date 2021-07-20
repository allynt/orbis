import React from 'react';

import { renderHook as tlRenderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';

import featureToggles from 'feature-toggles';

import { useToolbarItems } from './toolbar-config';
import {
  BOOKMARKS,
  DATA_LAYERS,
  PROFILE,
  SATELLITE_LAYERS,
  STORIES,
} from './toolbar-constants';

const mockStore = createMockStore();

const renderHook = initialProps => {
  return tlRenderHook(() => useToolbarItems(), {
    wrapper: ({ children, user }) => (
      <Provider store={mockStore({ accounts: { user } })}>{children}</Provider>
    ),
    initialProps,
  });
};

describe('useToolbarItems', () => {
  it('Includes the User Guide item', () => {
    const { result } = renderHook({ dispatch: jest.fn(), user: {} });
    expect(result.current).toContainEqual(
      expect.objectContaining({ label: 'User Guide' }),
    );
  });

  it.each([DATA_LAYERS, SATELLITE_LAYERS, BOOKMARKS, PROFILE])(
    'includes the %s item if the user has UserRole',
    label => {
      const { result } = renderHook({ user: { roles: ['UserRole'] } });
      expect(result.current).toContainEqual(expect.objectContaining({ label }));
    },
  );

  it('Includes the stories item if the feature toggle is enabled', () => {
    featureToggles.stories = true;
    const { result } = renderHook({ user: { roles: ['UserRole'] } });
    expect(result.current).toContainEqual(
      expect.objectContaining({ label: STORIES }),
    );
  });

  it('Includes the Admin item if the user is a MANAGER of any customer', () => {
    const { result } = renderHook({
      user: { customers: [{ type: 'MANAGER' }] },
    });
    expect(result.current).toContainEqual(
      expect.objectContaining({ label: 'Admin' }),
    );
  });
});
