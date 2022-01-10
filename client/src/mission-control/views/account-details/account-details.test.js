import React from 'react';

import { rest } from 'msw';

import { updateCustomerRequested } from 'mission-control/mission-control.slice';
import { server } from 'mocks/server';
// import fetchMock from 'jest-fetch-mock';

import { render, screen, waitFor, userEvent } from 'test/test-utils';

import { AccountDetailsComponent } from './account-details.component';

const setup = () => {
  const { store } = render(<AccountDetailsComponent />, {
    state: {
      accounts: { user: { name: 'Test Name' } },
      missionControl: {
        currentCustomer: {
          id: 'test-id-123',
          name: 'Test Org',
        },
      },
    },
  });

  return { store };
};

// fetchMock.enableMocks();

describe('<AccountDetails />', () => {
  it('Shows information in the info box', () => {
    setup();
    expect(screen.getByText('Test Name')).toBeInTheDocument();
    expect(screen.getByText('test-id-123')).toBeInTheDocument();
    expect(screen.getByText('Test Org')).toBeInTheDocument();
  });

  it('Dispatches the update customer action on submit', async () => {
    const { store } = setup();
    // fetchMock.once(JSON.stringify({}));
    server.use(
      rest.put('*/api/customers/:customerId/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
    );

    userEvent.type(
      screen.getByRole('textbox', { name: /registered number/i }),
      'test-number-123',
    );
    userEvent.click(screen.getByRole('button', { name: /save/i }), undefined, {
      skipPointerEventsCheck: true,
    });

    await waitFor(() => {
      expect(store.getActions()).toContainEqual(
        expect.objectContaining({ type: updateCustomerRequested.type }),
      );
    });
  });
});
