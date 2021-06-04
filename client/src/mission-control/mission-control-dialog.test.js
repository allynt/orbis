import React from 'react';
import { render } from '@testing-library/react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { MissionControlDialog } from './mission-control-dialog';

const mockStore = configureMockStore();

const setup = ({ isVisible = false }) => {
  return render(
    <Provider
      store={mockStore({
        missionControl: {
          isMissionControlDialogVisible: isVisible,
        },
      })}
    >
      <MissionControlDialog />
    </Provider>,
  );
};

describe('MissionControlDialog', () => {
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
