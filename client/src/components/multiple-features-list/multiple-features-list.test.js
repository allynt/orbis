// @ts-nocheck
import * as React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MultipleFeaturesList } from './multiple-features-list.component';

const FEATURES = [
  {
    properties: {
      id: 0,
      Model: 'S',
      Type: 'Saloon',
      Manufacturer: 'Tesla',
    },
  },
  {
    properties: {
      id: 1,
      Model: 'Taycan',
      Type: 'Shooting-brake',
      Manufacturer: 'Porsche',
    },
  },
  {
    properties: {
      id: 2,
      Model: 'i3',
      Type: 'Hatchback',
      Manufacturer: 'BMW',
    },
  },
];

const renderComponent = ({ primaryProperty, secondaryProperty } = {}) => {
  const onMoreDetailsClick = jest.fn();
  const utils = render(
    <MultipleFeaturesList
      features={FEATURES}
      primaryProperty={primaryProperty}
      secondaryProperty={secondaryProperty}
      onMoreDetailsClick={onMoreDetailsClick}
    />,
  );
  return { onMoreDetailsClick, ...utils };
};

describe('<MultipleFeaturesList />', () => {
  it('Shows the primaryProperty value for each feature', () => {
    const { getByText } = renderComponent({ primaryProperty: 'Model' });
    FEATURES.forEach(f =>
      expect(getByText(f.properties.Model)).toBeInTheDocument(),
    );
  });

  it('Shows the secondaryProperty key and value for each feature', () => {
    const { getByText, getAllByText } = renderComponent({
      secondaryProperty: 'Type',
    });
    expect(getAllByText(/type/i)).toHaveLength(FEATURES.length);
    FEATURES.forEach(f =>
      expect(getByText(f.properties.Type)).toBeInTheDocument(),
    );
  });

  it('Calls onClick when "More Details" for a feature is clicked', () => {
    const { getAllByRole, onMoreDetailsClick } = renderComponent();
    userEvent.click(getAllByRole('button', { name: /more\sdetails/i })[0]);
    expect(onMoreDetailsClick).toHaveBeenCalledWith(FEATURES[0]);
  });
});
