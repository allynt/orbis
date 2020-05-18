import React from 'react';

import { render, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LayerSelect } from './layer-select.component';

const setup = initialSelectedLayers => {
  const domain = {
    layers: [
      {
        name: 'test-layer-one',
        metadata: { label: 'test-layer-one-label', description: 'test-layer-one-description' },
      },
      {
        name: 'test-layer-two',
        metadata: { label: 'test-layer-two-label', description: 'test-layer-two-description' },
      },
    ],
  };
  const handleAddLayers = jest.fn();
  const handleRemoveLayer = jest.fn();
  const close = jest.fn();
  const utils = render(
    <LayerSelect
      domain={domain}
      onAddLayers={handleAddLayers}
      onRemoveLayer={handleRemoveLayer}
      initialSelectedLayers={initialSelectedLayers}
      close={close}
    />,
  );
  return { ...utils, handleAddLayers, layers: domain.layers };
};

describe('LayerSelect', () => {
  it('should show text when no domain is selected', () => {
    const { getByTestId } = render(<LayerSelect />);
    expect(getByTestId('layer-select-no-domain-message')).toBeInTheDocument();
  });

  it('should render the provided layers', () => {
    const { getAllByTestId, layers } = setup([]);
    const listItems = getAllByTestId(/^layer-list-item[a-zA-Z-]*$/);
    expect(listItems).toHaveLength(layers.length);
  });

  it('should have the button disabled if no layers are selected', () => {
    const { getByText } = setup([]);
    expect(getByText('Accept')).toHaveProperty('disabled', true);
  });

  it('should keep the Accept button enabled after user has made any change', () => {
    const { getByText, layers } = setup([]);
    expect(getByText('Accept')).toHaveProperty('disabled', true);
    userEvent.click(getByText(layers[0].metadata.label));
    expect(getByText('Accept')).toHaveProperty('disabled', false);
    userEvent.click(getByText(layers[0].metadata.label));
    expect(getByText('Accept')).toHaveProperty('disabled', false);
  });

  it('should disable the button when user has made no changes', () => {
    const { getByText } = setup([]);
    expect(getByText('Accept')).toHaveProperty('disabled', true);
  });

  it('should call onAddLayers with the selected layers when the button is clicked', () => {
    const { getByText, layers, handleAddLayers } = setup([]);
    userEvent.click(getByText(layers[0].metadata.label));
    userEvent.click(getByText('Accept'));
    expect(handleAddLayers).toHaveBeenCalled();
    expect(handleAddLayers).toHaveBeenCalledWith([layers[0]]);
  });

  describe('InfoBox', () => {
    it('should show when the info button is clicked', () => {
      const { getAllByLabelText, getByText, layers } = setup([]);
      const infoButtons = getAllByLabelText('Info');
      userEvent.click(infoButtons[0]);
      expect(getByText(layers[0].metadata.description)).toBeInTheDocument();
    });

    it('should remain visible when a following info button is clicked', () => {
      const { getAllByLabelText, getByText, layers } = setup([]);
      const infoButtons = getAllByLabelText('Info');
      userEvent.click(infoButtons[0]);
      userEvent.click(infoButtons[1]);
      expect(getByText(layers[1].metadata.description)).toBeInTheDocument();
    });

    it('should disappear when clicked away', () => {
      const { getAllByLabelText, queryByText, getByText, layers } = setup([]);
      userEvent.click(getAllByLabelText('Info')[0]);
      expect(getByText(layers[0].metadata.description)).toBeInTheDocument();
      userEvent.click(getByText('Select Your Layers'));
      wait(() => {
        expect(queryByText(layers[0].metadata.description)).not.toBeInTheDocument();
      });
    });
  });
});
