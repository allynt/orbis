import React from 'react';

import { render } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import PropertyRadio from './property-radio.component';

/**
 * @param {Partial<import('typings/orbis').Property>[]} properties
 * @param {Partial<import('typings/orbis').Property & {source_id: string}>} [selectedProperty]
 */
const renderComponent = (properties, selectedProperty) => {
  const onPropertyChange = jest.fn();
  const testLayerId = 'test_layer_id';
  const utils = render(
    <PropertyRadio
      layerSourceId={testLayerId}
      properties={properties}
      onPropertyChange={onPropertyChange}
      selectedProperty={
        selectedProperty && { source_id: testLayerId, ...selectedProperty }
      }
    />,
  );
  return { ...utils, onPropertyChange };
};

describe('<PropertyGroupRadio />', () => {
  it('Uses the application label for the radio if there is one', () => {
    const property = {
      name: 'property1',
      label: 'This is not the label',
      application: { orbis: { label: 'This is the label' } },
    };
    const { getByRole } = renderComponent([property]);
    expect(
      getByRole('radio', { name: property.application.orbis.label }),
    ).toBeInTheDocument();
  });

  it('Uses the property label if an application level one is not provided', () => {
    const property = {
      name: 'property1',
      label: 'This is the label',
    };
    const { getByRole } = renderComponent([property]);
    expect(getByRole('radio', { name: property.label })).toBeInTheDocument();
  });

  it('Shows controls if the selected property is one of the provided properties', () => {
    const property = { name: 'property1' };
    const { getByText } = renderComponent([property], property);
    expect(getByText('Range Filter')).toBeInTheDocument();
  });

  it("Shows property toggle buttons if it's a property group", () => {
    const properties = [
      { name: 'property1', type: 'percentage' },
      { name: 'property2', type: 'continuous' },
    ];
    const { getByRole } = renderComponent(properties, properties[0]);
    expect(getByRole('button', { name: 'Number' })).toBeInTheDocument();
  });

  it('Shows the radio as checked if the selected property is in the provided properties', () => {
    const properties = [{ name: 'property1' }, { name: 'property2' }];
    const { getByRole } = renderComponent(properties, properties[1]);
    expect(getByRole('radio')).toBeChecked();
  });

  it('Calls onPropertyChange with the first item in the list if there is no selectedProperty', () => {
    const property = { name: 'property1' };
    const { getByRole, onPropertyChange } = renderComponent([property]);
    userEvent.click(getByRole('radio'));
    expect(onPropertyChange).toBeCalledWith(property);
  });

  it('Calls onPropertyChange with the chosen property if the toggle button is clicked', () => {
    const properties = [
      { name: 'property1', type: 'percentage' },
      { name: 'property2', type: 'continuous' },
    ];
    const { getByRole, onPropertyChange } = renderComponent(
      properties,
      properties[0],
    );
    userEvent.click(getByRole('button', { name: 'Number' }));
    expect(onPropertyChange).toHaveBeenCalledWith(properties[1]);
  });

  it('Calls onPropertyChange when the radio is clicked with the selected property if the selected property is one of the provided properties', () => {
    const properties = [
      { name: 'property1', type: 'percentage' },
      { name: 'property2', type: 'continuous' },
    ];
    const { getByRole, onPropertyChange } = renderComponent(
      properties,
      properties[1],
    );
    userEvent.click(getByRole('radio'));
    expect(onPropertyChange).toHaveBeenCalledWith(
      expect.objectContaining(properties[1]),
    );
  });

  it('Calls onPropertyChange with the first property when the radio is clicked and the selected property is not in the group', () => {
    const properties = [
        { name: 'property1', type: 'percentage' },
        { name: 'property2', type: 'continuous' },
      ],
      selectedProperty = { name: 'property3' };
    const { getByRole, onPropertyChange } = renderComponent(
      properties,
      selectedProperty,
    );
    userEvent.click(getByRole('radio'));
    expect(onPropertyChange).toHaveBeenCalledWith(properties[0]);
  });
});
