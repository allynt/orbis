import React from 'react';

import { render, screen } from 'test/test-utils';

import PldMapComponent from './PldMapComponent';

jest.mock('react-map-gl', () => ({ Popup: ({ children }) => <>{children}</> }));

const sourceId = 'test/layer';
const feature = {
  id: '123',
  geometry: { coordinates: [0, 1] },
  properties: {
    pk: '123',
    Type: true,
    Address: 'Test Address',
    'Development Type': 'New Build',
    icon: 'Test Icon',
  },
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

describe('<PldMapComponent />', () => {
  it('should display a popup of feature details', () => {
    render(<PldMapComponent source={{ source_id: sourceId }} />, { state });

    expect(
      screen.getByRole('heading', { name: 'New Build' }),
    ).toBeInTheDocument();

    expect(screen.getByText('Address:')).toBeInTheDocument();
    expect(screen.getByText('Test Address')).toBeInTheDocument();
    expect(screen.queryByText('Test Icon')).not.toBeInTheDocument();
  });
});
