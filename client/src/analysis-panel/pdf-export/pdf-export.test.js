import React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { format } from 'date-fns';

import PDF from './pdf-export.component';

const mockStore = configureMockStore();

const initialUser = { name: 'John Smith', email: 'johnsmith@gmail.com' };

const initialState = {
  property: {
    source_id: 'astrosat/isolation_plus/age_census/r4v1',
    name: '% of people aged 0-17',
    application: {
      orbis: {
        label: 'People in the age band 0 - 17',
      },
    },
    aggregation: 'mean',
    aggregates: {
      England: 20.8,
      GB: 20.4,
      Scotland: 18.8,
      Wales: 20.3,
    },
    precision: 1,
    breakdown: [
      '% of people aged 0-17',
      '% of people aged 18-39',
      '% of people aged 40-64',
      '% of people aged 65+',
    ],
    source: 'Census (2011)',
    details: 'Percentage of people aged 17 and under.',
  },
  clickedFeatures: [
    {
      object: {
        properties: {
          '% of people aged 0-17': 23,
          area_name: 'S00117638',
          population: 178,
          households: 12,
        },
      },
    },
    {
      object: {
        properties: {
          '% of people aged 0-17': 29,
          area_name: 'S00119145',
          population: 88,
          households: 34,
        },
      },
    },
  ],
  screenshot: new Blob(
    [
      'https://c.files.bbci.co.uk/12A9B/production/_111434467_gettyimages-1143489763.jpg',
    ],
    { type: 'image/png' },
  ),
};

const getTotals = property => {
  return initialState.clickedFeatures.reduce(
    (acc, curr) => acc + curr.object.properties[property],
    0,
  );
};

const renderComponent = (state = initialState, user = initialUser) => {
  const history = createMemoryHistory({ initialEntries: ['/pdf-export'] });

  const store = mockStore({
    orbs: {
      isolationPlus: {
        ...state,
      },
    },
  });
  const utils = render(
    <Provider store={store}>
      <Router history={history}>
        <PDF user={user} />
      </Router>
    </Provider>,
  );
  return { ...utils, history, store };
};

describe('PDF', () => {
  it('renders a PDF preview', () => {
    const { getByText, getAllByText } = renderComponent();

    initialState.clickedFeatures.forEach(feat => {
      expect(
        getByText(`${feat.object.properties.area_name}`),
      ).toBeInTheDocument();
    });

    expect(getByText(`${getTotals('population')}`)).toBeInTheDocument();

    expect(getByText(`${getTotals('households')}`)).toBeInTheDocument();

    expect(
      getByText(initialState.property.application.orbis.label),
    ).toBeInTheDocument();

    expect(
      getByText(
        `${
          initialState.property.aggregation === 'sum' ? 'Sum' : 'Average'
        } of selected areas:`,
      ),
    ).toBeInTheDocument();

    expect(
      getAllByText(
        `${
          getTotals(initialState.property.name) /
          initialState.clickedFeatures.length
        }`,
      ).length,
    ).toEqual(2);

    Object.entries(initialState.property.aggregates).forEach(([key, value]) => {
      expect(getByText(`${key}:`)).toBeInTheDocument();
      expect(getByText(`${value}`)).toBeInTheDocument();
    });

    expect(
      getByText(`Source: ${initialState.property.source}`),
    ).toBeInTheDocument();
    expect(getByText(initialState.property.details)).toBeInTheDocument();

    expect(getByText(`Report run by: ${initialUser.name}`)).toBeInTheDocument();
    expect(getByText(`User Name: ${initialUser.email}`)).toBeInTheDocument();

    expect(
      getByText(`Date of the Report: ${format(new Date(), ['MMMM do Y'])}`),
    ).toBeInTheDocument();
  });

  it('renders the screenshot as image on screen', () => {
    const { getByTestId } = renderComponent();

    const covertedImage =
      'data:image/png;base64,aHR0cHM6Ly9jLmZpbGVzLmJiY2kuY28udWsvMTJBOUIvcHJvZHVjdGlvbi9fMTExNDM0NDY3X2dldHR5aW1hZ2VzLTExNDM0ODk3NjMuanBn';

    // Need a few ms pause to let image finish processing
    setTimeout(() => {
      expect(getByTestId('screenshot')).toHaveAttribute(
        'background-image',
        `url(${covertedImage})`,
      );
    }, 500);
  });

  it('shows data based on `Average/Sum` aggregation type', () => {
    const state = {
      ...initialState,
      property: {
        ...initialState.property,
        aggregation: 'sum',
      },
    };

    const { getByText } = renderComponent(state);

    expect(getByText(`Sum of selected areas:`)).toBeInTheDocument();
  });

  it('shows `Value` as aggregationLabel if only one clickedFeature', () => {
    const state = {
      ...initialState,
      clickedFeatures: [
        {
          object: {
            properties: {
              '% of people aged 0-17': 23,
              area_name: 'S00117638',
              population: 178,
              households: 12,
            },
          },
        },
      ],
    };

    const { getByText } = renderComponent(state);
    expect(getByText('Value of selected area:')).toBeInTheDocument();
  });

  it('does not show `breakdownAggregation` if no data for it exists', () => {
    const { queryByText } = renderComponent({
      ...initialState,
      property: { ...initialState.property, breakdown: undefined },
    });

    expect(
      queryByText('Breakdown of the data summed over all the selected areas:'),
    ).not.toBeInTheDocument();
  });

  it('does not display username section if username is undefined', () => {
    const { queryByTestId } = renderComponent(initialState, {
      email: 'johnsmith@gmail.com',
    });

    expect(queryByTestId('user-name')).not.toBeInTheDocument();
  });

  it('redirects to landing page if no property source_id in state', () => {
    const { history } = renderComponent({ property: {} }, { name: 'john' });

    expect(history.location.pathname).toEqual('/');
  });
});
