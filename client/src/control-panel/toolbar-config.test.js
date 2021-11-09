import React from 'react';

import { renderHook as tlRenderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import featureToggles from 'feature-toggles';

import { useToolbarItems } from './toolbar-config';
import {
  BOOKMARKS,
  DATA_LAYERS,
  PROFILE,
  SATELLITE_LAYERS,
  STORIES,
} from './toolbar-constants';

const mockStore = createMockStore([thunk]);

const renderHook = initialProps => {
  return tlRenderHook(({ dispatch }) => useToolbarItems({ dispatch }), {
    wrapper: ({ children, user, orbs }) => (
      <MemoryRouter>
        <Provider store={mockStore({ accounts: { user }, data: { orbs } })}>
          {children}
        </Provider>
      </MemoryRouter>
    ),
    initialProps,
  });
};

describe('useToolbarItems', () => {
  it('Includes the User Guide item', () => {
    const { result } = renderHook({ dispatch: jest.fn(), user: {} });
    expect(result.current).toContainEqual(
      expect.objectContaining({ id: 'User Guide' }),
    );
  });

  it.each([DATA_LAYERS, BOOKMARKS, PROFILE])(
    'includes the %s item if the user has UserRole',
    id => {
      const { result } = renderHook({ user: { roles: ['UserRole'] } });
      expect(result.current).toContainEqual(expect.objectContaining({ id }));
    },
  );

  it('Includes the Satellite item if user has UserRole and has an orb with the correct feature', () => {
    const { result } = renderHook({
      user: {
        roles: ['UserRole'],
        orbs: [{ features: ['satellites'] }],
      },
    });
    expect(result.current).toContainEqual(
      expect.objectContaining({ id: SATELLITE_LAYERS }),
    );
  });

  it('Includes the stories item if the feature toggle is enabled', () => {
    featureToggles.stories = true;
    const { result } = renderHook({ user: { roles: ['UserRole'] } });
    expect(result.current).toContainEqual(
      expect.objectContaining({ id: STORIES }),
    );
  });
});
