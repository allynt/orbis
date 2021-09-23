import React from 'react';

import { render, waitFor, screen, userEvent } from 'test/test-utils';

import UsersView from './users-view.component';

const setup = () =>
  render(<UsersView />, {
    state: {
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
    },
  });

describe('Users View', () => {
  beforeEach(() => {
    fetch.resetMocks();
    setup();
  });

  it('Displays the Create User dialog when the Create User Button is clicked', () => {
    userEvent.click(screen.getByText('Create User'));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('Create New User');
  });

  it('Closes the Create User Dialog when the close button is clicked', async () => {
    userEvent.click(screen.getAllByText('Create User')[0]);
    expect(screen.getByRole('dialog')).toBeVisible();
    userEvent.click(screen.getByLabelText('Close'));
    await waitFor(() => expect(screen.getByRole('dialog')).not.toBeVisible());
  });

  it('Closes the Create User Dialog when the form is successfully submitted', async () => {
    fetch.mockResponse(JSON.stringify({}));
    userEvent.click(screen.getByText('Create User'));
    userEvent.type(screen.getByLabelText('Email'), 'hello@test.com');
    userEvent.click(screen.getAllByText('Create User')[1]);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).not.toBeVisible();
    });
  });
});
