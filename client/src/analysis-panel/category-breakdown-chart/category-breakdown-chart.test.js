// @ts-nocheck

import * as React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

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

const setup = ({ clickedFeatures = CLICKED_FEATURES } = {}) =>
  render(
    <CategoryBreakdownChart
      selectedProperty={PROPERTY}
      clickedFeatures={clickedFeatures}
    />,
    {
      state: {
        orbs: {
          isolationPlus: {
            property: PROPERTY,
            clickedFeatures,
          },
        },
      },
    },
  );

describe('<CategoryBreakdownChart />', () => {
  it('returns null if clickedFeatures has no length', () => {
    setup({ clickedFeatures: [] });
    expect(screen.queryByText(PROPERTY.label)).not.toBeInTheDocument();
  });

  it('Shows the property label', () => {
    setup();
    expect(screen.getByText(PROPERTY.label)).toBeInTheDocument();
  });

  it('Shows the legend including for all selected categories', () => {
    setup();
    expect(screen.getByText('Apples')).toBeInTheDocument();
    expect(screen.getByText('Lemons')).toBeInTheDocument();
    expect(screen.getByText('Limes')).toBeInTheDocument();
  });

  it('Shows the total number of areas when no segment is clicked', () => {
    setup();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Areas')).toBeInTheDocument();
  });

  it('Shows the count of areas in a segment when that segment is clicked', () => {
    setup();
    userEvent.click(screen.getAllByRole('presentation')[0]);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('Unsets the selected segment if the same segment is clicked', () => {
    setup();
    userEvent.click(screen.getAllByRole('presentation')[0]);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    userEvent.click(screen.getAllByRole('presentation')[0]);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('Shows area if only one area is clicked', () => {
    setup({
      clickedFeatures: [{ object: { properties: { fruit: 'Limes' } } }],
    });
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Area')).toBeInTheDocument();
  });

  it('Unsets the selected segment if its category is removed from the features', () => {
    const { rerender } = setup();

    userEvent.click(screen.getAllByRole('presentation')[0]);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();

    const [, ...rest] = CLICKED_FEATURES;

    rerender(
      <CategoryBreakdownChart
        selectedProperty={PROPERTY}
        clickedFeatures={rest}
      />,
    );

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('Shows Area if only one area is clicked', () => {
    setup({
      clickedFeatures: [{ object: { properties: { fruit: 'Apples' } } }],
    });
    expect(screen.getByText(/area/i)).toBeInTheDocument();
  });
});
