import { render } from '@testing-library/react';
import * as React from 'react';
import { Provider } from 'react-redux';
import { LayerVisibilityCheckbox } from './layer-visibility-checkbox.component';
import configureMockStore from 'redux-mock-store';
import { setVisibility } from 'map/orbs/orbReducer';
import userEvent from '@testing-library/user-event';

const mockStore = configureMockStore();

const LAYER = { source_id: 'test/layer/1', metadata: { label: 'Test Layer' } };

const renderComponent = icon => {
  const dispatch = jest.fn();
  const utils = render(
    <Provider store={mockStore()}>
      <LayerVisibilityCheckbox
        selectedLayer={LAYER}
        dispatch={dispatch}
        icon={icon}
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
      setVisibility(expect.objectContaining({ source_id: LAYER.source_id })),
    );
  });

  it('Shows an icon if provided', () => {
    const { getByRole } = renderComponent('PicnicSite');
    expect(getByRole('img', { name: 'PicnicSite' })).toBeInTheDocument();
  });
});