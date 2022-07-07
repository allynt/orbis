import React from 'react';

import { rest } from 'msw';

import { server } from 'mocks/server';
import { render, waitFor, screen, userEvent } from 'test/test-utils';

import UsersView from './users-view.component';

const setup = () =>
  render(<UsersView />, {
    state: {
      accounts: { userKey: '123abc' },
      missionControl: {
        currentCustomer: {
          id: 1,
          name: 'test-customer',
          title: 'Test Customer',
          licences: [{ id: 1, orb: 'Rice' }],
        },
        customerUsers: [],
      },
    },
  });

describe('Users View', () => {
  beforeEach(() => {
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
    userEvent.click(screen.getByRole('button', { name: /Close/i }));
    await waitFor(() => expect(screen.getByRole('dialog')).not.toBeVisible());
  });

  it('Closes the Create User Dialog when the form is successfully submitted', async () => {
    server.use(
      rest.post(`*/api/customers/1/users/`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
    );

    userEvent.click(screen.getByText('Create User'));
    userEvent.type(screen.getByLabelText('Email'), 'hello@test.com');
    userEvent.click(screen.getAllByText('Create User')[1]);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).not.toBeVisible();
    });
  });
});
