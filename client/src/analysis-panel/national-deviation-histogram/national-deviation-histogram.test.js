import * as React from 'react';

import { AnalysisPanelProvider } from 'analysis-panel/analysis-panel-context';
import { render, screen, userEvent } from 'test/test-utils';

import { NationalDeviationHistogram } from './national-deviation-histogram.component';

const DEFAULT_PROPERTY = {
    label: 'hello',
  },
  WITH_AGGREGATES = {
    ...DEFAULT_PROPERTY,
    aggregates: { GB: 123, Scotland: 456 },
  },
  AGGREGATION_AREA = ['button', { name: /aggregation\sarea/i }];

describe('<NationalDeviationHistogram />', () => {
  it('Does not show the aggregate dropdown if aggregates is undefined', () => {
    render(
      <AnalysisPanelProvider>
        <NationalDeviationHistogram selectedProperty={DEFAULT_PROPERTY} />
      </AnalysisPanelProvider>,
    );

    expect(screen.queryByRole(...AGGREGATION_AREA)).not.toBeInTheDocument();
  });

  it('Shows the aggregate dropdown if the property has aggregates', () => {
    render(
      <AnalysisPanelProvider>
        <NationalDeviationHistogram selectedProperty={WITH_AGGREGATES} />
      </AnalysisPanelProvider>,
    );

    expect(screen.getByRole(...AGGREGATION_AREA)).toBeInTheDocument();
  });

  it('Shows the GB aggregation value by default', () => {
    render(
      <AnalysisPanelProvider>
        <NationalDeviationHistogram selectedProperty={WITH_AGGREGATES} />
      </AnalysisPanelProvider>,
    );

    expect(
      screen.getByText(WITH_AGGREGATES.aggregates.GB.toString()),
    ).toBeInTheDocument();
  });

  it('Changes the displayed aggregate to the selected value', () => {
    render(
      <AnalysisPanelProvider>
        <NationalDeviationHistogram selectedProperty={WITH_AGGREGATES} />
      </AnalysisPanelProvider>,
    );

    userEvent.click(screen.getByRole(...AGGREGATION_AREA));
    userEvent.click(screen.getByRole('option', { name: 'Scotland' }));
    expect(
      screen.getByText(WITH_AGGREGATES.aggregates.Scotland.toString()),
    ).toBeInTheDocument();
  });
});
