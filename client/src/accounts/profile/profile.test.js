// @ts-nocheck
import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { logout, updateUser } from 'accounts/accounts.slice';

import Profile from './profile.component';

const mockStore = configureMockStore([thunk]);

const renderComponent = () => {
  const store = mockStore({
    accounts: { userKey: '123', user: { name: 'Fred' } },
  });
  const utils = render(<Profile />, {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
  return { store, ...utils };
};

describe('<Profile />', () => {
  it('dispatches the logout action when logout is clicked', () => {
    const { getByRole, store } = renderComponent();
    userEvent.click(getByRole('button', { name: /logout/i }));
    expect(store.getActions()).toEqual(
      expect.arrayContaining([expect.objectContaining({ ...logout() })]),
    );
  });

  it('dispatches the updateUser action when the user is updated', async () => {
    fetch.once(JSON.stringify({}));
    const { getByRole, store } = renderComponent();
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
