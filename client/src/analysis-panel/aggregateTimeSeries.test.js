// @ts-nocheck
import { aggregateTimeSeries } from './aggregateTimeSeries';

const TIMESTAMP_0 = '2021-02-12T00:00:00.000Z',
  TIMESTAMP_1 = '2021-02-13T00:00:00.000Z',
  TIMESTAMP_2 = '2021-02-14T00:00:00.000Z',
  CLICKED_FEATURES = [
    {
      object: {
        properties: {
          test: [
            { timestamp: TIMESTAMP_0, value: 1 },
            { timestamp: TIMESTAMP_1, value: 2 },
            { timestamp: TIMESTAMP_2, value: 3 },
          ],
        },
      },
    },
    {
      object: {
        properties: {
          test: [
            { timestamp: TIMESTAMP_0, value: 4 },
            { timestamp: TIMESTAMP_1, value: 5 },
            { timestamp: TIMESTAMP_2, value: 6 },
          ],
        },
      },
    },
    {
      object: {
        properties: {
          test: [
            { timestamp: TIMESTAMP_0, value: 7 },
            { timestamp: TIMESTAMP_1, value: 8 },
            { timestamp: TIMESTAMP_2, value: 9 },
          ],
        },
      },
    },
  ];

describe('aggregateTimeSeries', () => {
  it('Returns an array of aggregated timestamp values', () => {
    const result = aggregateTimeSeries(CLICKED_FEATURES, { name: 'test' });
    expect(result).toEqual([
      { timestamp: TIMESTAMP_0, value: 1 + 4 + 7 },
      { timestamp: TIMESTAMP_1, value: 2 + 5 + 8 },
      { timestamp: TIMESTAMP_2, value: 3 + 6 + 9 },
    ]);
  });

  it('Aggregates values using the aggregation method in the property', () => {
    const result = aggregateTimeSeries(CLICKED_FEATURES, {
      name: 'test',
      aggregation: 'mean',
    });
    expect(result).toEqual([
      { timestamp: TIMESTAMP_0, value: (1 + 4 + 7) / 3 },
      { timestamp: TIMESTAMP_1, value: (2 + 5 + 8) / 3 },
      { timestamp: TIMESTAMP_2, value: (3 + 6 + 9) / 3 },
    ]);
  });

  it('works for one clicked feature', () => {
    const result = aggregateTimeSeries([CLICKED_FEATURES[0]], { name: 'test' });
    expect(result).toEqual(CLICKED_FEATURES[0].object.properties.test);
  });

  it('Returns values set to precision if present', () => {
    const result = aggregateTimeSeries(
      [
        {
          object: {
            properties: {
              test: [
                { timestamp: TIMESTAMP_0, value: 1.12 },
                { timestamp: TIMESTAMP_1, value: 2.23 },
                { timestamp: TIMESTAMP_2, value: 3.34 },
              ],
            },
          },
        },
        {
          object: {
            properties: {
              test: [
                { timestamp: TIMESTAMP_0, value: 4.12 },
                { timestamp: TIMESTAMP_1, value: 5.23 },
                { timestamp: TIMESTAMP_2, value: 6.34 },
              ],
            },
          },
        },
        {
          object: {
            properties: {
              test: [
                { timestamp: TIMESTAMP_0, value: 7.12 },
                { timestamp: TIMESTAMP_1, value: 8.23 },
                { timestamp: TIMESTAMP_2, value: 9.34 },
              ],
            },
          },
        },
      ],
      {
        name: 'test',
        aggregation: 'mean',
        precision: 1,
      },
    );
    expect(result).toEqual([
      { timestamp: TIMESTAMP_0, value: 4.1 },
      { timestamp: TIMESTAMP_1, value: 5.2 },
      { timestamp: TIMESTAMP_2, value: 6.3 },
    ]);
  });
});
