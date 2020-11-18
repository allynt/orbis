import React from 'react';

import { render } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import RadioProperty from './radio-property.component';

const singleObjectData = {
  name: 'Census 2011: % of people in the age band 65+',
  type: 'percentage',
  min: 0,
  max: 100,
};

const pairObjectData = [
  {
    name: 'Census 2011: % of people in the age band 40 - 64',
    type: 'percentage',
    property_group: '1',
    min: 0,
    max: 100,
  },
  {
    name: 'Census 2011: number of people in the age band 40 - 64',
    type: 'continuous',
    property_group: '1',
    min: 0,
    max: 100,
  },
];

const colorScheme = 'RdBu';
const categoryPath = 'Test Path';

const onRadioClick = jest.fn();
const onToggleClick = jest.fn();
const onSliderChange = jest.fn();

const renderComponent = (data, selectedProperty) => {
  return render(
    <RadioProperty
      data={data}
      onRadioClick={onRadioClick}
      onToggleClick={onToggleClick}
      onSliderChange={onSliderChange}
      selectedProperty={selectedProperty}
      colorScheme={colorScheme}
      categoryPath={categoryPath}
    />,
  );
};

describe('RadioProperty', () => {
  it('renders a RadioProperty', () => {
    const { getByText } = renderComponent(pairObjectData, {});

    expect(getByText(pairObjectData[0].name)).toBeInTheDocument();

    // [pairObjectData[0].min, pairObjectData[0].max].forEach(n => {
    //   expect(getByDisplayValue(n)).toBeInTheDocument();
    // });
  });

  it('shows display dropdown when property is selected', () => {
    const { getByText } = renderComponent(pairObjectData, pairObjectData[0]);

    expect(getByText('Percentage')).toBeInTheDocument();
    expect(getByText('Number')).toBeInTheDocument();
  });

  it('does not show toggles for single properties', () => {
    const { queryByText } = renderComponent(singleObjectData, singleObjectData);

    expect(queryByText('Percentage')).not.toBeInTheDocument();
    expect(queryByText('Number')).not.toBeInTheDocument();
  });

  it('calls click handler with single property if Radio is clicked', () => {
    const { getByText } = renderComponent(singleObjectData, singleObjectData);

    userEvent.click(getByText(singleObjectData.name));
    expect(onRadioClick).toHaveBeenCalledWith(singleObjectData);
  });

  it('calls click handler with percentage property of pair by default if Radio is clicked', () => {
    const { getByText } = renderComponent(pairObjectData, pairObjectData[0]);

    userEvent.click(getByText(pairObjectData[0].name));
    expect(onRadioClick).toHaveBeenCalledWith(pairObjectData[0]);
  });

  it('calls click handler with number property if number toggle is clicked', () => {
    const { getByText } = renderComponent(pairObjectData, pairObjectData[0]);

    expect(onRadioClick).toHaveBeenCalledWith(pairObjectData[0]);

    userEvent.click(getByText('Number'));

    expect(onToggleClick).toHaveBeenCalledWith(pairObjectData[1]);
  });

  xit('calls click handler with slider data if slider is changed', () => {
    const { getByText } = renderComponent(singleObjectData, singleObjectData);

    expect();
  });
});
