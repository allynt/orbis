import React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { RadioPicker } from './radio-picker.component';

const mockStore = configureStore();

const defaultSelectedLayer = {
  source_id: 'test/layer',
  metadata: {
    properties: [{ name: 'property1' }, { name: 'property2' }],
  },
};

const renderComponent = (
  selectedLayer = defaultSelectedLayer,
  initialState = {},
) =>
  render(<RadioPicker selectedLayer={selectedLayer} dispatch={jest.fn()} />, {
    wrapper: ({ children }) => (
      <Provider store={mockStore(initialState)}>{children}</Provider>
    ),
  });

describe('<RadioPicker />', () => {
  it('displays a radio for each selectable property in the source', () => {
    const { getByLabelText } = renderComponent();
    defaultSelectedLayer.metadata.properties.forEach(property =>
      expect(getByLabelText(property.name)).toBeInTheDocument(),
    );
  });

  it('checks the selected property', () => {
    const initialState = {
      orbs: {
        isolationPlus: {
          property: { source_id: 'test/layer', name: 'property1' },
        },
      },
    };
    const { getByLabelText } = renderComponent(undefined, initialState);
    expect(getByLabelText('property1')).toHaveProperty('checked', true);
  });

  it('has an info icon for each radio', () => {
    const { getAllByRole } = renderComponent();
    expect(getAllByRole('tooltip')).toHaveLength(
      Object.keys(defaultSelectedLayer.metadata.properties).length,
    );
  });
});
