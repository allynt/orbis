import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { LayerSelect } from './layer-select.component';

const setup = initialSelectedLayers => {
  const domain = {
    layers: [
      {
        name: 'test-layer-one',
        metadata: { label: 'test-layer-one-label', description: 'test-layer-one-description' }
      },
      { name: 'test-layer-two', metadata: { label: 'test-layer-two-label', description: 'test-layer-two-description' } }
    ]
  };
  const handleAddLayers = jest.fn();
  const handleRemoveLayer = jest.fn();
  const utils = render(
    <LayerSelect
      domain={domain}
      onAddLayers={handleAddLayers}
      onRemoveLayer={handleRemoveLayer}
      initialSelectedLayers={initialSelectedLayers}
    />
  );
  return { ...utils, handleAddLayers, layers: domain.layers };
};

describe('LayerSelect', () => {
  it('should show text when no domain is selected', () => {
    const { getByTestId } = render(<LayerSelect />);
    expect(getByTestId('layer-select-no-domain-message')).toBeInTheDocument();
  });

  it('should render the provided layers', () => {
    const { getAllByTestId, layers } = setup();
    const listItems = getAllByTestId(/^layer-list-item[a-zA-Z-]*$/);
    expect(listItems).toHaveLength(layers.length);
  });

  it('should have the button disabled if no layers are selected', () => {
    const { getByText } = setup();
    expect(getByText('Add')).toHaveProperty('disabled', true);
  });

  it('should enable the add button when at least one layer is selected', () => {
    const { getByText, layers } = setup();
    fireEvent.click(getByText(layers[0].metadata.label));
    expect(getByText('Add')).toHaveProperty('disabled', false);
  });

  it('should disabled the button when all layers are deselected', () => {
    const { getByText, layers } = setup();
    fireEvent.click(getByText(layers[0].metadata.label));
    expect(getByText('Add')).toHaveProperty('disabled', false);
    fireEvent.click(getByText(layers[0].metadata.label));
    expect(getByText('Add')).toHaveProperty('disabled', true);
  });

  it('should call onAddLayers with the selected layers when the button is clicked', () => {
    const { getByText, layers, handleAddLayers } = setup();
    fireEvent.click(getByText(layers[0].metadata.label));
    fireEvent.click(getByText('Add'));
    expect(handleAddLayers).toHaveBeenCalled();
    expect(handleAddLayers).toHaveBeenCalledWith([layers[0]]);
  });

  describe('InfoBox', () => {
    it('should show when the info button is clicked', () => {
      const { getAllByLabelText, getByText, layers } = setup();
      const infoButtons = getAllByLabelText('Info');
      fireEvent.click(infoButtons[0]);
      expect(getByText(layers[0].metadata.description)).toBeInTheDocument();
    });

    it('should remain visible when a following info button is clicked', async () => {
      const { getAllByLabelText, getByText, layers } = setup();
      const infoButtons = getAllByLabelText('Info');
      fireEvent.click(infoButtons[0]);
      fireEvent.click(infoButtons[1]);
      expect(getByText(layers[1].metadata.description)).toBeInTheDocument();
    });
  });
});
