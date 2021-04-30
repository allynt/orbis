import React from 'react';

import { render } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import RadioProperty from './radio-property.component';

const singleObjectData = [
  {
    name: 'Census 2011: % of people in the age band 65+',
    label: 'People in the age band 65+',
    type: 'percentage',
    min: 0,
    max: 100,
  },
];

const pairObjectData = [
  {
    name: 'Census 2011: number of people in the age band 40 - 64',
    label: 'People in the age band 40 - 64',
    type: 'continuous',
    property_group: '1',
    min: 0,
    max: 100,
  },
  {
    name: 'Census 2011: % of people in the age band 40 - 64',
    label: 'People in the age band 40 - 64',
    type: 'percentage',
    property_group: '1',
    min: 0,
    max: 100,
  },
];

/**
 * @param {Partial<import('typings/orbis').Property>[]} properties
 * @param {Partial<import('typings/orbis').Property & {source_id: string}>} selectedProperty
 */
const renderComponent = (properties, selectedProperty) => {
  const onPropertyChange = jest.fn();
  const testLayerId = 'test_layer_id';
  const utils = render(
    <RadioProperty
      layerSourceId={testLayerId}
      data={properties}
      onPropertyChange={onPropertyChange}
      selectedProperty={{ source_id: testLayerId, ...selectedProperty }}
    />,
  );
  return { ...utils, onPropertyChange };
};

describe('RadioProperty', () => {
  it('renders a RadioProperty', () => {
    const { getByRole } = renderComponent(pairObjectData, {});

    expect(
      getByRole('radio', { name: pairObjectData[1].label }),
    ).toBeInTheDocument();
  });

  it('shows display dropdown when property is selected', () => {
    const { getByRole } = renderComponent(pairObjectData, pairObjectData[0]);

    expect(getByRole('button', { name: 'Percentage' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Number' })).toBeInTheDocument();
  });

  it('does not show toggles for single properties', () => {
    const { queryByRole } = renderComponent(
      singleObjectData,
      singleObjectData[0],
    );
    expect(
      queryByRole('button', { name: 'Percentage' }),
    ).not.toBeInTheDocument();
    expect(queryByRole('button', { name: 'Number' })).not.toBeInTheDocument();
  });

  it('calls click handler with single property if Radio is clicked', () => {
    const { getByRole, onPropertyChange } = renderComponent(
      singleObjectData,
      {},
    );

    userEvent.click(getByRole('radio', { name: singleObjectData.label }));
    expect(onPropertyChange).toHaveBeenCalledWith(singleObjectData[0]);
  });

  it('calls click handler with percentage property of pair by default if Radio is clicked', () => {
    const { getByRole, onPropertyChange } = renderComponent(pairObjectData, {});

    userEvent.click(getByRole('radio', { name: pairObjectData[1].label }));
    expect(onPropertyChange).toHaveBeenCalledWith(pairObjectData[1]);
  });

  it('calls click handler with number property if number toggle is clicked', () => {
    const { getByRole, onPropertyChange } = renderComponent(
      pairObjectData,
      pairObjectData[1],
    );

    userEvent.click(getByRole('button', { name: 'Number' }));

    expect(onPropertyChange).toHaveBeenCalledWith(pairObjectData[0]);
  });

  it('calls click handler with null if property matches selectedProperty (single)', () => {
    const { getByRole, onPropertyChange } = renderComponent(
      singleObjectData,
      singleObjectData[0],
    );

    userEvent.click(getByRole('radio', { name: singleObjectData.label }));
    expect(onPropertyChange).toHaveBeenCalledWith(null);
  });

  it('calls click handler with null if property matches selectedProperty (grouped properties)', () => {
    const { getByRole, onPropertyChange } = renderComponent(
      pairObjectData,
      pairObjectData[0],
    );

    userEvent.click(getByRole('radio', { name: pairObjectData[0].label }));
    expect(onPropertyChange).toHaveBeenCalledWith(null);
  });

  it('uses first available property if no `percentage` available', () => {
    const data = [
      {
        name: 'Test decile property',
        label: 'Test decile label',
        type: 'decile',
      },
    ];

    const { getByRole } = renderComponent(data);

    expect(getByRole('radio', { name: data[0].label })).toBeInTheDocument();
  });
});
