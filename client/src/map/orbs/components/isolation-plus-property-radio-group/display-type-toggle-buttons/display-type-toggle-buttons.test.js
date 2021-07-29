import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DisplayTypeToggleButtons } from './display-type-toggle-buttons.component';

/**
 * @param {Partial<import('typings').Property>[]} properties
 * @param {Partial<import('typings').Property>} selectedProperty
 * @returns
 */
const renderComponent = (properties, selectedProperty = {}) => {
  const onChange = jest.fn();
  const utils = render(
    <DisplayTypeToggleButtons
      properties={properties}
      selectedProperty={selectedProperty}
      onChange={onChange}
    />,
  );
  return { ...utils, onChange };
};

describe('<DisplayTypeToggleButtons />', () => {
  it('Shows a button for each property', () => {
    const { getAllByRole } = renderComponent([
      { name: 'property1' },
      { name: 'property2' },
      { name: 'property3' },
    ]);

    expect(getAllByRole('button')).toHaveLength(3);
  });

  it('Uses the property_toggle_label if provided', () => {
    const { getByRole } = renderComponent([
      {
        name: 'property1',
        application: {
          orbis: { display: { property_toggle_label: 'Horses' } },
        },
      },
      {
        name: 'property2',
        application: {
          orbis: { display: { property_toggle_label: 'People' } },
        },
      },
    ]);

    expect(getByRole('button', { name: 'Horses' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'People' })).toBeInTheDocument();
  });

  it('Falls back to Percentage, Number, Categories, or Decile if property_toggle_label is not provided', () => {
    const { getByRole } = renderComponent([
      { name: 'property1', type: 'continuous' },
      { name: 'property2', type: 'decile' },
      { name: 'property3', type: 'discrete' },
      { name: 'property4', type: 'percentage' },
    ]);
    expect(getByRole('button', { name: 'Number' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Categories' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Decile' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Percentage' })).toBeInTheDocument();
  });

  it('Calls onChange with the clicked property', () => {
    const property = { name: 'property1', type: 'percentage' };
    const { getByRole, onChange } = renderComponent([property]);
    userEvent.click(getByRole('button'));
    expect(onChange).toBeCalledWith(property);
  });

  it('Does not call on change if the clicked property is the selected property', () => {
    const properties = [
      { name: 'property1', type: 'percentage' },
      { name: 'property2', type: 'continuous' },
    ];
    const { getByRole, onChange } = renderComponent(properties, properties[1]);
    userEvent.click(getByRole('button', { name: 'Number' }));
    expect(onChange).not.toBeCalled();
  });
});
