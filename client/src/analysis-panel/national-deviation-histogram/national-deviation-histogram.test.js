import * as React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { NationalDeviationHistogram } from './national-deviation-histogram.component';
import { AnalysisPanelProvider } from 'analysis-panel/analysis-panel-context';

const mockStore = configureMockStore();

const DEFAULT_PROPERTY = {
    label: 'hello',
  },
  WITH_AGGREGATES = {
    ...DEFAULT_PROPERTY,
    aggregates: { GB: 123, Scotland: 456 },
  };

const renderComponent = property =>
  render(<NationalDeviationHistogram selectedProperty={property} />, {
    wrapper: ({ children }) => (
      <Provider store={mockStore()}>
        <AnalysisPanelProvider>{children}</AnalysisPanelProvider>
      </Provider>
    ),
  });

const AGGREGATION_AREA = ['button', { name: /aggregation\sarea/i }];

describe('<NationalDeviationHistogram />', () => {
  it('Does not show the aggregate dropdown if aggregates is undefined', () => {
    const { queryByRole } = renderComponent(DEFAULT_PROPERTY);

    expect(queryByRole(...AGGREGATION_AREA)).not.toBeInTheDocument();
  });

  it('Shows the aggregate dropdown if the property has aggregates', () => {
    const { getByRole } = renderComponent(WITH_AGGREGATES);

    expect(getByRole(...AGGREGATION_AREA)).toBeInTheDocument();
  });

  it('Shows the GB aggregation value by default', () => {
    const { getByText } = renderComponent(WITH_AGGREGATES);

    expect(
      getByText(WITH_AGGREGATES.aggregates.GB.toString()),
    ).toBeInTheDocument();
  });

  it('Changes the displayed aggregate to the selected value', () => {
    const { getByRole, getByText } = renderComponent(WITH_AGGREGATES);

    userEvent.click(getByRole(...AGGREGATION_AREA));
    userEvent.click(getByRole('option', { name: 'Scotland' }));
    expect(
      getByText(WITH_AGGREGATES.aggregates.Scotland.toString()),
    ).toBeInTheDocument();
  });
});
