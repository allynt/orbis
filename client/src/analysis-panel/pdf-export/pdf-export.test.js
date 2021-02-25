import React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { createMemoryHistory } from 'history';
import { ConnectedRouter, connectRouter } from 'connected-react-router';

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
    router: connectRouter(history),
    orbs: {
      isolationPlus: {
        ...state,
      },
    },
  });
  const utils = render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <PDF user={user} />
      </ConnectedRouter>
    </Provider>,
  );
  return { ...utils, history, store };
};

describe('PDF', () => {
  it('renders a PDF preview', () => {
    const { getByText } = renderComponent();

    initialState.clickedFeatures.forEach(feat => {
      expect(
        getByText(`${feat.object.properties.area_name}`),
      ).toBeInTheDocument();
    });

    expect(
      getByText(`Total population: ${getTotals('population')}`),
    ).toBeInTheDocument();

    expect(
      getByText(`Total households: ${getTotals('households')}`),
    ).toBeInTheDocument();

    expect(
      getByText(initialState.property.application.orbis.label),
    ).toBeInTheDocument();

    // expect(
    //   getByText(
    //     `${
    //       initialState.property.aggregation === 'sum' ? 'Sum' : 'Average'
    //     } of selected areas:`,
    //   ),
    // ).toBeInTheDocument();

    // expect(
    //   getByText(
    //     `${
    //       getTotals(initialState.property.name) /
    //       initialState.clickedFeatures.length
    //     }`,
    //   ),
    // ).toBeInTheDocument();

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

  it('redirects to home screen if no property loaded in state', () => {
    const { history } = renderComponent({});

    console.log('History: ', history);

    expect(history.location.pathname).toEqual('/');
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
      pdfData: {
        ...initialState.pdfData,
        aggregation: {
          aggregationLabel: 'Sum',
          areaValue: 365,
        },
      },
    };

    const { getByText } = renderComponent(state);

    expect(
      getByText(
        `${state.pdfData.aggregation.aggregationLabel} of selected areas:`,
      ),
    ).toBeInTheDocument();

    expect(
      getByText(`${state.pdfData.aggregation.areaValue}`),
    ).toBeInTheDocument();
  });
  it('does not show `breakdownAggregation` if no data for it exists', () => {
    const { getByText } = renderComponent({
      ...initialState,
      property: { ...initialState.property, breakdown: undefined },
    });

    expect(
      getByText('Breakdown of the data summed over all the selected areas:'),
    ).not.toBeInTheDocument();
  });

  it('does not display username section if username is undefined', () => {
    const { queryByTestId } = renderComponent(initialState, {
      email: 'johnsmith@gmail.com',
    });

    expect(queryByTestId('user-name')).not.toBeInTheDocument();
  });
});
