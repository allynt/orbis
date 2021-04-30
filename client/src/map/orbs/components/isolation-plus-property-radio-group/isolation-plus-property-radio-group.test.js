import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { RadioPicker } from './isolation-plus-property-radio-group.component';
import { setOther } from 'map/orbs/layers.slice';

const mockStore = configureStore();

let dispatch = null;

const renderComponent = (selectedLayer, initialState = {}) => {
  dispatch = jest.fn();
  return render(
    <RadioPicker selectedLayer={selectedLayer} dispatch={dispatch} />,
    {
      wrapper: ({ children }) => (
        <Provider store={mockStore(initialState)}>{children}</Provider>
      ),
    },
  );
};

describe('<RadioPicker />', () => {
  it('renders a radio for each property group', () => {
    const { getByRole } = renderComponent({
      metadata: {
        properties: [
          { name: 'property1', property_group: '1', label: 'Group 1' },
          { name: 'property2', property_group: '1' },
          { name: 'property3', label: 'Property 2' },
        ],
      },
    });
    expect(getByRole('radio', { name: 'Group 1' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Property 2' })).toBeInTheDocument();
  });

  it(`dispatches the ${setOther} action with the selected property when the property changes`, () => {
    const property = { name: 'property1' };
    const { getByRole } = renderComponent({
      authority: 'test',
      namespace: 'layer',
      metadata: { properties: [property] },
    });
    userEvent.click(getByRole('radio'));
    expect(dispatch).toBeCalledWith(
      setOther(expect.objectContaining({ other: { property } })),
    );
  });

  it(`dispatches set other with property as null if the selected property is clicked`, () => {
    const property = { name: 'property1' };
    const { getByRole } = renderComponent(
      {
        authority: 'test',
        namespace: 'layer',
        source_id: 'test/layer',
        metadata: { properties: [property] },
      },
      {
        orbs: {
          layers: {
            'test/layer': {
              other: { property: { ...property, source_id: 'test/layer' } },
            },
          },
        },
      },
    );
    userEvent.click(getByRole('radio'));
    expect(dispatch).toBeCalledWith(
      setOther(expect.objectContaining({ other: { property: {} } })),
    );
  });
});
