import * as React from 'react';
import { render } from '@testing-library/react';
import { AnalysisPanel } from './analysis-panel.component';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';
import { setPickedInfo } from 'map/orbs/slices/isolation-plus.slice';

const mockStore = configureMockStore();

const renderComponent = (state = {}) => {
  const store = mockStore({
    orbs: {
      isolationPlus: {
        ...state,
      },
    },
  });
  const utils = render(<AnalysisPanel />, {
    wrapper: props => <Provider store={store} {...props} />,
  });
  return { ...utils, store };
};

describe('<AnalysisPanel />', () => {
  it("doesn't show anything if picked info doesn't have properties", () => {
    const { queryByText } = renderComponent({
      property: { name: 'test' },
      pickedInfo: { object: {} },
    });
    expect(queryByText(/test/i)).not.toBeInTheDocument();
  });

  it('sets the pickedInfo to undefined if close is clicked', () => {
    const { getByRole, store } = renderComponent({
      property: { name: 'test' },
      pickedInfo: { object: { properties: { code: 'hello' } } },
    });
    userEvent.click(getByRole('button', { name: 'Close' }));
    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: setPickedInfo.type,
          payload: undefined,
        }),
      ]),
    );
  });
});
