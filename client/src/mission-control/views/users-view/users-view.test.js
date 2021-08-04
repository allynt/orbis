import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import UsersView from './users-view.component';

const mockStore = configureMockStore([thunk]);

const setup = () => {
  const utils = render(
    <Provider
      store={mockStore({
        accounts: { userKey: '123abc' },
        missionControl: {
          currentCustomer: {
            id: '0',
            name: 'test-customer',
            title: 'Test Customer',
            licences: [{ id: '1', orb: 'Rice' }],
          },
          customerUsers: [],
        },
      })}
    >
      <UsersView />
    </Provider>,
  );
  return { ...utils };
};

describe('Users View', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('Displays the Create User dialog when the Create User Button is clicked', () => {
    const { getByText, getByRole } = setup();
    userEvent.click(getByText('Create User'));
    const dialog = getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('Create New User');
  });

  it('Closes the Create User Dialog when the close button is clicked', async () => {
    const { getAllByText, getByRole, getByLabelText } = setup();
    userEvent.click(getAllByText('Create User')[0]);
    expect(getByRole('dialog')).toBeVisible();
    userEvent.click(getByLabelText('Close'));
    await waitFor(() => expect(getByRole('dialog')).not.toBeVisible());
  });

  it('Closes the Create User Dialog when the form is successfully submitted', async () => {
    fetch.mockResponse(JSON.stringify({}));
    const { getByText, getAllByText, getByLabelText, getByRole } = setup();
    userEvent.click(getByText('Create User'));
    userEvent.type(getByLabelText('Email'), 'hello@test.com');
    userEvent.click(getAllByText('Create User')[1]);
    await waitFor(() => {
      expect(getByRole('dialog')).not.toBeVisible();
    });
  });
});
