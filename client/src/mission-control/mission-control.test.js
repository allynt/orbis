import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { MissionControl } from './mission-control.component';

const mockStore = configureMockStore();

const setup = ({ isVisible = false }) => {
  return render(
    <Provider
      store={mockStore({
        accounts: { userKey: '123abc' },
        missionControl: {
          isMissionControlDialogVisible: isVisible,
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
      <MissionControl />
    </Provider>,
  );
};

describe('MissionControl', () => {
  it('opens dialog if `isVisible` is true', () => {
    const { getByRole } = setup({ isVisible: true });
    const dialog = getByRole('dialog');

    expect(dialog).toBeInTheDocument();
  });

  it('hides dialog if `isVisible` is false', () => {
    const { queryByRole } = setup({});
    const dialog = queryByRole('dialog');

    expect(dialog).not.toBeInTheDocument();
  });

  it('Displays the Create User dialog when the Create User Button is clicked', () => {
    const { getByText, getByRole } = setup({ isVisible: true });
    userEvent.click(getByText('Create User'));
    const dialog = getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('Create New User');
  });

  it('Closes the Create User Dialog when the close button is clicked', async () => {
    const { getAllByText, getByRole, getByLabelText, queryByRole } = setup({
      isVisible: true,
    });
    userEvent.click(getAllByText('Create User')[0]);
    expect(getByRole('dialog')).toBeInTheDocument();
    userEvent.click(getByLabelText('Close'));
    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('Closes the Create User Dialog when the form is successfully submitted', async () => {
    fetch.mockResponse(JSON.stringify({}));
    const { getByText, getAllByText, queryByRole, getByLabelText } = setup({
      isVisible: true,
    });
    userEvent.click(getByText('Create User'));
    userEvent.type(getByLabelText('Email'), 'hello@test.com');
    userEvent.click(getAllByText('Create User')[1]);
    await waitFor(() => {
      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
