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

let onPropertyChange = null;
let onSliderChange = null;

const renderComponent = (data, selectedProperty) => {
  onPropertyChange = jest.fn();
  onSliderChange = jest.fn();
  const testLayerId = 'test_layer_id';
  return render(
    <RadioProperty
      layerSourceId={testLayerId}
      data={data}
      onPropertyChange={onPropertyChange}
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
    expect(onPropertyChange).toHaveBeenCalledWith(singleObjectData[0]);
  });

  it('calls click handler with percentage property of pair by default if Radio is clicked', () => {
    const { getByRole } = renderComponent(pairObjectData, {});

    userEvent.click(getByRole('radio', { name: pairObjectData[1].label }));
    expect(onPropertyChange).toHaveBeenCalledWith(pairObjectData[1]);
  });

  it('calls click handler with number property if number toggle is clicked', () => {
    const { getByRole } = renderComponent(pairObjectData, pairObjectData[1]);

    userEvent.click(getByRole('button', { name: 'Number' }));

    expect(onPropertyChange).toHaveBeenCalledWith(pairObjectData[0]);
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

  it('calls click handler with null if property matches selectedProperty (single)', () => {
    const { getByRole } = renderComponent(
      singleObjectData,
      singleObjectData[0],
    );

    userEvent.click(getByRole('radio', { name: singleObjectData.label }));
    expect(onPropertyChange).toHaveBeenCalledWith(null);
  });

  it('calls click handler with null if property matches selectedProperty (grouped properties)', () => {
    const { getByRole } = renderComponent(pairObjectData, pairObjectData[0]);

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

  it('shows a date stepper if the selected property is timeseries and has a list of timestamps', () => {
    const { getByText } = renderComponent(singleObjectData, {
      ...singleObjectData[0],
      timeseries: true,
      timeseries_latest_timestamp: new Date(2020, 0, 1).toISOString(),
      timeseries_timestamps: [new Date(2020, 0, 1).toISOString()],
    });
    expect(getByText(/timeseries/i)).toBeInTheDocument();
  });

  it('shows labels for the start, middle, and end dates', () => {
    const { getByText } = renderComponent(singleObjectData, {
      ...singleObjectData[0],
      timeseries: true,
      timeseries_latest_timestamp: new Date(2020, 0, 1).toISOString(),
      timeseries_timestamps: [
        new Date(2016, 0, 1).toISOString(),
        new Date(2017, 0, 1).toISOString(),
        new Date(2018, 0, 1).toISOString(),
        new Date(2019, 0, 1).toISOString(),
        new Date(2020, 0, 1).toISOString(),
      ],
    });
    expect(getByText('01-01-16')).toBeInTheDocument();
    expect(getByText('01-01-18')).toBeInTheDocument();
    expect(getByText('01-01-20')).toBeInTheDocument();
  });
});
