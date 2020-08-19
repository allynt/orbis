import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { RadioPicker } from './radio-picker.component';

const mockStore = configureStore();

const defaultSelectedLayer = {
  source_id: 'test/layer',
  metadata: {
    properties: {
      property1: {},
      property2: {},
    },
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
    Object.keys(defaultSelectedLayer.metadata.properties).forEach(key =>
      expect(getByLabelText(key)).toBeInTheDocument(),
    );
  });

  it('checks the selected property', () => {
    const initialState = {
      orbs: {
        isolationPlus: {
          properties: { 'test/layer': 'property1' },
        },
      },
    };
    const { getByLabelText } = renderComponent(undefined, initialState);
    expect(getByLabelText('property1')).toHaveProperty('checked', true);
  });

  it('has an info icon for each radio', () => {
    const { getAllByRole } = renderComponent();
    expect(getAllByRole('button')).toHaveLength(
      Object.keys(defaultSelectedLayer.metadata.properties).length,
    );
  });

  it('shows the property description when the info icon is clicked', () => {
    const description = 'Test Description';
    const { getByRole, getByText } = renderComponent({
      ...defaultSelectedLayer,
      metadata: {
        ...defaultSelectedLayer.metadata,
        properties: {
          ...defaultSelectedLayer.metadata.properties,
          property1: { description },
        },
      },
    });
    userEvent.click(getByRole('button', { name: /property1/i }));
    expect(getByText(description)).toBeInTheDocument();
  });
});
