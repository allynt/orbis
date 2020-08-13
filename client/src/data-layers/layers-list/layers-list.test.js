import React from 'react';
import { render } from '@testing-library/react';
import { LayersList } from './layers-list.component';
import userEvent from '@testing-library/user-event';

describe('<LayersList />', () => {
  it('displays an item for each selected layer', () => {
    const layerNames = ['Layer 1', 'Layer 2'];
    const { getByText } = render(
      <LayersList
        selectedLayers={layerNames.map(layerName => ({
          metadata: { label: layerName },
        }))}
      />,
    );
    layerNames.forEach(layerName =>
      expect(getByText(layerName)).toBeInTheDocument(),
    );
  });

  it('shows the component for a selected layer when clicked', () => {
    const sidebarComponents = {
      'test/layer/1': () => <p>I'm the component</p>,
    };
    const selectedLayers = [
      { source_id: 'test/layer/1', metadata: { label: 'Layer 1' } },
    ];
    const { getByRole, getByText } = render(
      <LayersList
        selectedLayers={selectedLayers}
        sidebarComponents={sidebarComponents}
      />,
    );
    userEvent.click(getByRole('button', { name: /Layer 1/i }));
    expect(getByText("I'm the component")).toBeInTheDocument();
  });
});
