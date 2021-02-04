import * as React from 'react';
import { render } from '@testing-library/react';
import { CategoryBreakdownChart } from './category-breakdown-chart.component';

const PROPERTY = {
    type: 'discrete',
    name: 'fruit',
    label: 'Fruit',
    categories: {
      Apples: {
        color: '#8db600',
      },
      Oranges: {
        color: '#ffa500',
      },
      Lemons: {
        color: '#ffff00',
      },
      Limes: {
        color: '#00FF00',
      },
    },
  },
  CLICKED_FEATURES = [
    {
      object: {
        properties: {
          fruit: 'Apples',
        },
      },
    },
    {
      object: {
        properties: {
          fruit: 'Lemons',
        },
      },
    },
    {
      object: {
        properties: {
          fruit: 'Limes',
        },
      },
    },
  ];

const renderComponent = () =>
  render(
    <CategoryBreakdownChart
      selectedProperty={PROPERTY}
      clickedFeatures={CLICKED_FEATURES}
    />,
  );

describe('<CategoryBreakdownChart />', () => {
  it('Shows the property label', () => {
    const { getByText } = renderComponent();
    expect(getByText(PROPERTY.label)).toBeInTheDocument();
  });

  it('Shows the legend including for all selected categories', () => {
    const { getByText } = renderComponent();
    expect(getByText('Apples')).toBeInTheDocument();
    expect(getByText('Lemons')).toBeInTheDocument();
    expect(getByText('Limes')).toBeInTheDocument();
  });

  it('Shows the total number of areas when no segment is clicked', () => {
    const { getByText } = renderComponent();
    expect(getByText('3')).toBeInTheDocument();
  });

  it.todo('Shows the count of areas in a segment when that segment is clicked');
});
