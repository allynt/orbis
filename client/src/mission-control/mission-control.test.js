import React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MissionControl } from './mission-control.component';

const mockStore = configureMockStore([thunk]);

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
});
