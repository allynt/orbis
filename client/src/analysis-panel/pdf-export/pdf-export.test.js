import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Provider } from 'react-redux';
import { MapProvider } from 'MapContext';
import configureMockStore from 'redux-mock-store';

import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { format } from 'date-fns';

import PDF from './pdf-export.component';
import { AnalysisPanelProvider } from 'analysis-panel/analysis-panel-context';

const mockStore = configureMockStore();

const initialUser = { name: 'John Smith', email: 'johnsmith@gmail.com' };

const initialLicence = 'Crown Copyright (2020) released under OGL v3.0';

const initialState = {
  property: {
    source_id: 'test/source',
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
};

const getTotals = property => {
  return initialState.clickedFeatures.reduce(
    (acc, curr) => acc + curr.object.properties[property],
    0,
  );
};

const renderComponent = ({
  state = initialState,
  licence = initialLicence,
  user = initialUser,
}) => {
  const history = createMemoryHistory({ initialEntries: ['/pdf-export'] });

  const close = jest.fn();

  const store = mockStore({
    accounts: { user },
  });

  const utils = render(
    <Provider store={store}>
      <Router history={history}>
        <MapProvider>
          <AnalysisPanelProvider
            clickedFeatures={state.clickedFeatures}
            selectedProperty={state.property}
            selectedTimestamp={new Date(2019, 0, 1).getTime()}
            currentSource={{
              source_id: 'test/source',
              metadata: {
                properties: [
                  { name: '% of people aged 0-17', aggregation: 'mean' },
                ],
              },
            }}
          >
            <PDF
              licence={licence}
              close={close}
              selectedProperty={state.property}
              selectedTimestamp={new Date(2019, 0, 1).getTime()}
            />
          </AnalysisPanelProvider>
        </MapProvider>
      </Router>
    </Provider>,
  );
  return { ...utils, close, history, store };
};

describe('PDF', () => {
  it('renders a PDF preview', () => {
    const { getByText, getAllByText, getByLabelText } = renderComponent({});

    expect(getByText('Download PDF Report')).toBeInTheDocument();

    expect(getByLabelText('Close')).toBeInTheDocument();

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

    expect(getByText(initialState.property.source)).toBeInTheDocument();

    expect(getByText(initialState.property.details)).toBeInTheDocument();

    expect(getByText(initialLicence)).toBeInTheDocument();

    expect(getByText(`Report run by: ${initialUser.name}`)).toBeInTheDocument();
    expect(getByText(`User Name: ${initialUser.email}`)).toBeInTheDocument();

    expect(
      getByText(`Date of the Report: ${format(new Date(), ['MMMM do Y'])}`),
    ).toBeInTheDocument();
  });

  it('shows data based on `Average/Sum` aggregation type', () => {
    const state = {
      ...initialState,
      property: {
        ...initialState.property,
        aggregation: 'sum',
      },
    };

    const { getByText } = renderComponent({ state });

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

    const { getByText } = renderComponent({ state });
    expect(getByText('Value of selected area:')).toBeInTheDocument();
  });

  it('does not show `breakdownAggregation` if no data for it exists', () => {
    const { queryByText } = renderComponent({
      state: {
        ...initialState,
        property: { ...initialState.property, breakdown: undefined },
      },
    });

    expect(
      queryByText('Breakdown of the data summed over all the selected areas:'),
    ).not.toBeInTheDocument();
  });

  it('does not show `breakdownAggregation` if array is empty', () => {
    const state = {
      state: {
        ...initialState,
        clickedFeatures: [
          {
            object: {
              properties: {
                area_name: 'test-name-1',
                population: 0,
                households: 0,
                '% of people aged 0-17': 0,
                '% of people aged 18-39': 0,
                '% of people aged 40-64': 0,
                '% of people aged 65+': 0,
              },
            },
          },
          {
            object: {
              properties: {
                area_name: 'test-name-2',
                population: 0,
                households: 0,
                '% of people aged 0-17': 0,
                '% of people aged 18-39': 0,
                '% of people aged 40-64': 0,
                '% of people aged 65+': 0,
              },
            },
          },
        ],
      },
    };

    const { queryByText } = renderComponent({ state });

    expect(
      queryByText('Breakdown of the data summed over all the selected areas:'),
    ).not.toBeInTheDocument();
  });

  it('shows 0 values in aggregation section', () => {
    const state = {
      ...initialState,
      property: {
        ...initialState.property,
        aggregates: { GB: 0, England: 0, Scotland: 0, Wales: 0 },
      },
      clickedFeatures: [
        {
          object: {
            properties: {
              area_name: 'test-name-1',
              population: 0,
              households: 0,
              '% of people aged 0-17': 0,
              '% of people aged 18-39': 0,
              '% of people aged 40-64': 0,
              '% of people aged 65+': 0,
            },
          },
        },
        {
          object: {
            properties: {
              area_name: 'test-name-2',
              population: 0,
              households: 0,
              '% of people aged 0-17': 0,
              '% of people aged 18-39': 0,
              '% of people aged 40-64': 0,
              '% of people aged 65+': 0,
            },
          },
        },
      ],
    };

    const { getAllByText } = renderComponent({ state });

    expect(getAllByText('0').length).toEqual(7);
  });

  it('does not display username section if username is undefined', () => {
    const { queryByTestId } = renderComponent({
      user: { email: 'johnsmith@gmail.com' },
    });

    expect(queryByTestId('user-name')).not.toBeInTheDocument();
  });

  it('shows a note if the data is based on historical data', () => {
    const { getByText } = renderComponent({
      state: {
        ...initialState,
        property: {
          ...initialState.property,
          timeseries_latest_timestamp: new Date(2020, 0, 1).toISOString(),
        },
      },
    });
    expect(getByText(/historical/i)).toBeInTheDocument();
  });

  // Don't put more tests below this one. Something in it causes the subsequent tests to fail.
  // They don't when using Wallaby.js but do when running jest directly.
  it('closes dialog when PDF download button is clicked', () => {
    const { getByRole, close } = renderComponent({});

    userEvent.click(getByRole('button', { name: 'Download PDF Report' }));

    expect(close).toHaveBeenCalled();
  });
});
