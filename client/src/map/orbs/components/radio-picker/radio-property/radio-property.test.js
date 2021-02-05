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

let onClick = null;
let onSliderChange = null;

const renderComponent = (data, selectedProperty) => {
  onClick = jest.fn();
  onSliderChange = jest.fn();
  const testLayerId = 'test_layer_id';
  return render(
    <RadioProperty
      layerSourceId={testLayerId}
      data={data}
      onClick={onClick}
      onSliderChange={onSliderChange}
      selectedProperty={{ source_id: testLayerId, ...selectedProperty }}
    />,
  );
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
    const { getByRole } = renderComponent(singleObjectData, {});

    userEvent.click(getByRole('radio', { name: singleObjectData.label }));
    expect(onClick).toHaveBeenCalledWith(singleObjectData[0]);
  });

  it('calls click handler with first property of pair by default if Radio is clicked', () => {
    const { getByRole } = renderComponent(pairObjectData, {});

    userEvent.click(getByRole('radio', { name: pairObjectData[0].label }));
    expect(onClick).toHaveBeenCalledWith(pairObjectData[0]);
  });

  it('calls click handler with number property if number toggle is clicked', () => {
    const { getByRole } = renderComponent(pairObjectData, pairObjectData[1]);

    userEvent.click(getByRole('button', { name: 'Number' }));

    expect(onClick).toHaveBeenCalledWith(pairObjectData[0]);
  });

  it('Shows a legend for discrete properties', () => {
    const { getByRole } = render(
      <RadioProperty
        data={[
          {
            name: 'testProperty',
            categories: {
              apple: {
                color: 'green',
              },
              orange: {
                color: 'orange',
              },
            },
          },
        ]}
        selectedProperty={{
          name: 'testProperty',
          type: 'discrete',
          categories: {
            apple: {
              color: 'green',
            },
            orange: {
              color: 'orange',
            },
          },
        }}
      />,
    );
    expect(getByRole('list')).toBeInTheDocument();
  });

  it('calls click handler with empty object if property matches selectedProperty (single)', () => {
    const { getByRole } = renderComponent(
      singleObjectData,
      singleObjectData[0],
    );

    userEvent.click(getByRole('radio', { name: singleObjectData.label }));
    expect(onClick).toHaveBeenCalledWith({});
  });

  it('calls click handler with empty object if property matches selectedProperty (group)', () => {
    const { getByRole } = renderComponent(pairObjectData, pairObjectData[0]);

    userEvent.click(getByRole('radio', { name: pairObjectData[0].label }));
    expect(onClick).toHaveBeenCalledWith({});
  });
});
