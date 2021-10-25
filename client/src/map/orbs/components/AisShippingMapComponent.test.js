import React from 'react';

import { render, screen } from 'test/test-utils';

import AisShippingMapComponent from './AisShippingMapComponent';

jest.mock('react-map-gl', () => ({ Popup: ({ children }) => <>{children}</> }));

describe('<AisShippingMapComponent />', () => {
  it('should display a popup of feature details', () => {
    const sourceId = 'test/layer';
    const feature = {
      id: '123',
      geometry: { coordinates: [0, 1] },
      properties: { pk: '123', Type: true, 'Vessel Name': 'Test Vessel' },
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

    render(<AisShippingMapComponent source={{ source_id: sourceId }} />, {
      state,
    });

    expect(
      screen.getByRole('heading', { name: 'Vessel Information' }),
    ).toBeInTheDocument();

    expect(screen.getByText('Vessel Name:')).toBeInTheDocument();
    expect(screen.getByText('Test Vessel')).toBeInTheDocument();
  });
});
