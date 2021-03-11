// @ts-nocheck

import * as React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CategoryBreakdownChart } from './category-breakdown-chart.component';

const mockStore = configureMockStore();

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

const renderComponent = ({ clickedFeatures = CLICKED_FEATURES } = {}) =>
  render(
    <Provider
      store={mockStore({
        orbs: {
          isolationPlus: {
            property: PROPERTY,
            clickedFeatures,
          },
        },
      })}
    >
      <CategoryBreakdownChart
        selectedProperty={PROPERTY}
        clickedFeatures={clickedFeatures}
      />
    </Provider>,
  );

describe('<CategoryBreakdownChart />', () => {
  it('returns null if clickedFeatures has no length', () => {
    const { queryByText } = renderComponent({ clickedFeatures: [] });
    expect(queryByText(PROPERTY.label)).not.toBeInTheDocument();
  });

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
    expect(getByText('Areas')).toBeInTheDocument();
  });

  it('Shows the count of areas in a segment when that segment is clicked', () => {
    const { getAllByRole, getByText } = renderComponent();
    userEvent.click(getAllByRole('presentation')[0]);
    expect(getByText('1 / 3')).toBeInTheDocument();
  });

  it('Unsets the selected segment if the same segment is clicked', () => {
    const { getAllByRole, getByText } = renderComponent();
    userEvent.click(getAllByRole('presentation')[0]);
    expect(getByText('1 / 3')).toBeInTheDocument();
    userEvent.click(getAllByRole('presentation')[0]);
    expect(getByText('3')).toBeInTheDocument();
  });

  it('Shows area if only one area is clicked', () => {
    const { getByText } = renderComponent({
      clickedFeatures: [{ object: { properties: { fruit: 'Limes' } } }],
    });
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('Area')).toBeInTheDocument();
  });

  it('Unsets the selected segment if its category is removed from the features', () => {
    const { getByText, getAllByRole, rerender } = renderComponent();
    userEvent.click(getAllByRole('presentation')[0]);
    expect(getByText('1 / 3')).toBeInTheDocument();
    const [, ...rest] = CLICKED_FEATURES;
    rerender(
      <Provider
        store={mockStore({
          orbs: {
            isolationPlus: {
              property: PROPERTY,
              clickedFeatures: rest,
            },
          },
        })}
      >
        <CategoryBreakdownChart
          selectedProperty={PROPERTY}
          clickedFeatures={rest}
        />
      </Provider>,
    );
    expect(getByText('2')).toBeInTheDocument();
  });

  it('Shows Area if only one area is clicked', () => {
    const { getByText } = renderComponent({
      clickedFeatures: [{ object: { properties: { fruit: 'Apples' } } }],
    });
    expect(getByText(/area/i)).toBeInTheDocument();
  });
});
