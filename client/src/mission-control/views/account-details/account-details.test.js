import React from 'react';

import fetchMock from 'jest-fetch-mock';

import { updateCustomerRequested } from 'mission-control/mission-control.slice';
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

describe('<AccountDetails />', () => {
  it('Shows information in the info box', () => {
    setup();
    expect(screen.getByText('Test Name')).toBeInTheDocument();
    expect(screen.getByText('test-id-123')).toBeInTheDocument();
    expect(screen.getByText('Test Org')).toBeInTheDocument();
  });

  it('Dispatches the update customer action on submit', async () => {
    const { store } = setup();
    fetchMock.once(JSON.stringify({}));

    userEvent.type(
      screen.getByRole('textbox', { name: /registered number/i }),
      'test-number-123',
    );
    userEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(store.getActions()).toContainEqual(
        expect.objectContaining({ type: updateCustomerRequested.type }),
      );
    });
  });
});
