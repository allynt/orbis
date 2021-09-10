// @ts-nocheck
import React from 'react';

import userEvent from '@testing-library/user-event';

import { logout, updateUser } from 'accounts/accounts.slice';
import { render, waitFor } from 'test/test-utils';

import Profile from './profile.component';

const state = {
  accounts: {
    userKey: '123',
    user: { email: 'fred@gmail.com', name: 'Fred' },
  },
};

describe('<Profile />', () => {
  it('dispatches the logout action when logout is clicked', () => {
    const { getByRole, store } = render(<Profile />, { state });
    userEvent.click(getByRole('button', { name: /logout/i }));
    expect(store.getActions()).toEqual(
      expect.arrayContaining([expect.objectContaining({ ...logout() })]),
    );
  });

  it('dispatches the updateUser action when the user is updated', async () => {
    fetch.once(JSON.stringify({}));
    const { getByRole, store } = render(<Profile />, { state });
    userEvent.type(getByRole('textbox', { name: /name/i }), 'John');
    userEvent.click(getByRole('button', { name: /update\saccount/i }));
    await waitFor(() =>
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ ...updateUser({}) }),
        ]),
      ),
    );
  });
});
