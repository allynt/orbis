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
    application: {
      orbis: {
        label: 'People in the age band 0 - 17',
      },
    },
    aggregates: {
      England: 20.8,
      GB: 20.4,
      Scotland: 18.8,
      Wales: 20.3,
    },
  },
  pdfData: {
    screenshot: new Blob(
      [
        'https://c.files.bbci.co.uk/12A9B/production/_111434467_gettyimages-1143489763.jpg',
      ],
      { type: 'image/png' },
    ),
    areasOfInterest: [
      { area_name: 'S00121202' },
      { area_name: 'S00119201' },
      { area_name: 'S00126290' },
    ],
    populationTotal: 264,
    householdTotal: 122,
    aggregation: {
      aggregationLabel: 'Average',
      areaValue: 21.6,
    },
    moreInformation: 'Percentage of people aged 17 and under.',
  },
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
    const { getByText } = renderComponent();

    initialState.pdfData.areasOfInterest.forEach(aoi => {
      expect(getByText(`${aoi.area_name}`)).toBeInTheDocument();
    });

    expect(
      getByText(`Total population: ${initialState.pdfData.populationTotal}`),
    ).toBeInTheDocument();

    expect(
      getByText(`Total households: ${initialState.pdfData.householdTotal}`),
    ).toBeInTheDocument();

    expect(
      getByText(initialState.property.application.orbis.label),
    ).toBeInTheDocument();

    expect(
      getByText(
        `${initialState.pdfData.aggregation.aggregationLabel} of selected areas:`,
      ),
    ).toBeInTheDocument();

    expect(
      getByText(`${initialState.pdfData.aggregation.areaValue}`),
    ).toBeInTheDocument();

    Object.entries(initialState.property.aggregates).forEach(([key, value]) => {
      expect(getByText(`${key}:`)).toBeInTheDocument();
      expect(getByText(`${value}`)).toBeInTheDocument();
    });

    expect(getByText(initialState.pdfData.moreInformation)).toBeInTheDocument();

    expect(getByText(`Report run by: ${initialUser.name}`)).toBeInTheDocument();
    expect(getByText(`User Name: ${initialUser.email}`)).toBeInTheDocument();

    expect(
      getByText(`Date of the Report: ${format(new Date(), ['MMMM do Y'])}`),
    ).toBeInTheDocument();
  });

  it('redirects to home screen if no property loaded in state', () => {
    const { history } = renderComponent({ pdfData: {} });

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

  it('does not display username section if username is undefined', () => {
    const { queryByTestId } = renderComponent(initialState, {
      email: 'johnsmith@gmail.com',
    });

    expect(queryByTestId('user-name')).not.toBeInTheDocument();
  });
});
