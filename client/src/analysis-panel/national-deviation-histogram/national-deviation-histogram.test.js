import * as React from 'react';
import { render, waitFor } from '@testing-library/react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { NationalDeviationHistogram } from './national-deviation-histogram.component';
import userEvent from '@testing-library/user-event';

const mockStore = configureMockStore();

const DEFAULT_PROPERTY = {
    label: 'hello',
  },
  WITH_AGGREGATES = {
    ...DEFAULT_PROPERTY,
    aggregates: { GB: 123, Scotland: 456 },
  };

const renderComponent = property => {
  const store = mockStore({
    orbs: {
      isolationPlus: {
        property,
      },
    },
  });

  const utils = render(
    <Provider store={store}>
      <NationalDeviationHistogram
        selectedProperty={property}
        data={[
          {
            x: 134,
            y: 15015,
          },
          {
            x: 402,
            y: 23278,
          },
          {
            x: 670,
            y: 2953,
          },
          {
            x: 938,
            y: 383,
          },
          {
            x: 1206,
            y: 70,
          },
          {
            x: 1474,
            y: 18,
          },
          {
            x: 1742,
            y: 8,
          },
          {
            x: 2010,
            y: 2,
          },
          {
            x: 2278,
            y: 1,
          },
          {
            x: 2546,
            y: 1,
          },
        ]}
      />
    </Provider>,
  );

  return { ...utils };
};

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
