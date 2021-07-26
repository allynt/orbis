import React from 'react';

import { renderHook as tlRenderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';

import useUserRoleAuthorization from './useUserRoleAuthorization';

const mockStore = createMockStore();

const renderHook = initialProps => {
  return tlRenderHook(({ roles }) => useUserRoleAuthorization(roles), {
    wrapper: ({ children, user }) => (
      <Provider store={mockStore({ accounts: { user } })}>{children}</Provider>
    ),
    initialProps,
  });
};

describe('useUserRoleAuthorization', () => {
  it("Returns false if there's no user", () => {
    const { result } = renderHook({ user: null, roles: ['testRole'] });
    expect(result.current).toBe(false);
  });

  it('Returns false if the user does not have roles', () => {
    const { result } = renderHook({ user: {}, roles: ['testRole'] });
    expect(result.current).toBe(false);
  });

  it('Returns false if the user does not have the required roles', () => {
    const { result } = renderHook({
      user: { roles: ['notTestRole'] },
      roles: ['testRole'],
    });
    expect(result.current).toBe(false);
  });

  it('Returns true if the user has the requested roles', () => {
    const { result } = renderHook({
      user: { roles: ['testRole', 'notTestRole'] },
      roles: ['testRole'],
    });
    expect(result.current).toBe(true);
  });

  it('Returns true if the user is granted the required role', () => {
    const { result, rerender } = renderHook({
      user: { roles: ['notTestRole'] },
      roles: ['testRole'],
    });
    expect(result.current).toBe(false);
    rerender({
      user: { roles: ['testRole', 'notTestRole'] },
      roles: ['testRole'],
    });
    expect(result.current).toBe(true);
  });
});
