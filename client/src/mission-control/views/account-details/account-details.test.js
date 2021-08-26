import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { updateCustomerRequested } from 'mission-control/mission-control.slice';

import { AccountDetailsComponent } from './account-details.component';

const mockStore = createMockStore([thunk]);

const renderComponent = () => {
  const store = mockStore({
    accounts: { user: { name: 'Test Name' } },
    missionControl: {
      currentCustomer: {
        id: 'test-id-123',
        name: 'Test Org',
      },
    },
  });
  const utils = render(<AccountDetailsComponent />, {
    wrapper: props => <Provider store={store} {...props} />,
  });
  return { ...utils, store };
};

describe('<AccountDetails />', () => {
  it('Shows information in the info box', () => {
    const { getByText } = renderComponent();
    expect(getByText('Test Name')).toBeInTheDocument();
    expect(getByText('test-id-123')).toBeInTheDocument();
    expect(getByText('Test Org')).toBeInTheDocument();
  });

  it('Dispatches the update customer action on submit', async () => {
    fetchMock.once(JSON.stringify({}));
    const { getByRole, store } = renderComponent();
    userEvent.type(
      getByRole('textbox', { name: /registered number/i }),
      'test-number-123',
    );
    userEvent.click(getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(store.getActions()).toContainEqual(
        expect.objectContaining({ type: updateCustomerRequested.type }),
      );
    });
  });
});
