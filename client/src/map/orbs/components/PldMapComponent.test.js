import React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import PldMapComponent from './PldMapComponent';

const mockStore = configureMockStore();
jest.mock('react-map-gl', () => ({ Popup: ({ children }) => <>{children}</> }));

const sourceId = 'test/layer';
const feature = {
  id: '123',
  geometry: { coordinates: [0, 1] },
  properties: { pk: '123', Type: true, Address: 'Test Address' },
};
const state = {
  orbs: {
    layers: {
      [sourceId]: {
        clickedFeatures: [feature],
        data: { features: [feature] },
      },
    },
  },
};

const renderComponent = () => {
  const store = mockStore(state);
  const utils = render(<PldMapComponent source={{ source_id: sourceId }} />, {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
  return { ...utils, store };
};

describe('<PldMapComponent />', () => {
  it('should display a popup of feature details', () => {
    const { getByText, getByRole } = renderComponent();

    expect(
      getByRole('heading', { name: 'Planning Policy Lead' }),
    ).toBeInTheDocument();

    expect(getByText('Address:')).toBeInTheDocument();
    expect(getByText('Test Address')).toBeInTheDocument();
  });
});
