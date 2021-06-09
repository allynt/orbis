import * as React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { setVisibility } from 'map/orbs/layers.slice';

import { LayerVisibilityCheckbox } from './layer-visibility-checkbox.component';

const mockStore = configureMockStore();

const LAYER = { source_id: 'test/layer/1', metadata: { label: 'Test Layer' } };

const renderComponent = ({ icon, info } = {}) => {
  const dispatch = jest.fn();
  const utils = render(
    <Provider store={mockStore()}>
      <LayerVisibilityCheckbox
        selectedLayer={LAYER}
        dispatch={dispatch}
        icon={icon}
        info={info}
      />
    </Provider>,
  );
  return { dispatch, ...utils };
};

describe('<LayerVisibilityCheckbox />', () => {
  it('shows a checkbox for the selected layer', () => {
    const { getByRole } = renderComponent();
    expect(
      getByRole('checkbox', { name: LAYER.metadata.label }),
    ).toBeInTheDocument();
  });

  it(`Dispatches the ${setVisibility.type} action on click`, () => {
    const { dispatch, getByRole } = renderComponent();
    userEvent.click(getByRole('checkbox'));
    expect(dispatch).toHaveBeenCalledWith(
      setVisibility(expect.objectContaining({ key: LAYER.source_id })),
    );
  });

  it('Shows an icon if provided', () => {
    const { getByRole } = renderComponent({ icon: 'PicnicSite' });
    expect(getByRole('img', { name: 'PicnicSite' })).toBeInTheDocument();
  });

  it('Shows an info icon if info prop is supplied', () => {
    const { getByRole } = renderComponent({ info: 'hello' });
    expect(getByRole('button', { name: 'Info' })).toBeInTheDocument();
  });
});
