import React from 'react';

import { renderHook } from '@testing-library/react-hooks';

import {
  AnalysisPanelProvider,
  useAnalysisPanelContext,
} from './analysis-panel-context';

const renderContext = ({
  clickedFeatures = undefined,
  selectedProperty = undefined,
  currentSource = undefined,
  selectedTimestamp = undefined,
} = {}) =>
  renderHook(() => useAnalysisPanelContext(), {
    wrapper: ({ children }) => (
      <AnalysisPanelProvider
        clickedFeatures={clickedFeatures}
        currentSource={currentSource}
        selectedProperty={selectedProperty}
        selectedTimestamp={selectedTimestamp}
      >
        {children}
      </AnalysisPanelProvider>
    ),
  });

describe('AnalysisPanelContext', () => {
  describe('areasOfInterest', () => {
    const selectedProperty = {
      source_id: 'test/selected/property/latest',
      name: 'area_name',
      label: 'Test Property',
      description: 'Test Property Description',
      source: 'https://test.com',
    };

    it('returns undefined if clickedFeatures is undefined', () => {
      const { result } = renderContext();
      expect(result.current.areasOfInterest).toBeUndefined();
    });

    it('returns mapped `area_name` properties from all of the `clickedFeatures`', () => {
      const clickedFeatures = [
          { object: { properties: { area_name: 'area name 1' } } },
          { object: { properties: { area_name: 'area name 2' } } },
          { object: { properties: { area_name: 'area name 3' } } },
        ],
        expected = ['area name 1', 'area name 2', 'area name 3'];
      const { result } = renderContext({ clickedFeatures, selectedProperty });
      expect(result.current.areasOfInterest).toEqual(expected);
    });

    it('returns undefined if no features have an `area_name` property', () => {
      const original = console.error;
      console.error = jest.fn();

      const { result } = renderContext({
        clickedFeatures: [
          {
            object: {
              properties: {},
            },
          },
          {
            object: {
              properties: {},
            },
          },
        ],
        selectedProperty,
      });
      expect(result.current.areasOfInterest).toBeUndefined();

      console.error = original;
    });
  });

  describe('populationTotal', () => {
    const selectedProperty = {
      source_id: 'test/selected/property/latest',
      name: 'population',
      label: 'Test Property',
      description: 'Test Property Description',
      source: 'https://test.com',
    };

    it('returns total of population in all features', () => {
      const clickedFeatures = [
        { object: { properties: { population: 5 } } },
        { object: { properties: { population: 10 } } },
        { object: { properties: { population: 15 } } },
      ];

      const { result } = renderContext({ clickedFeatures, selectedProperty });
      expect(result.current.populationTotal).toEqual('30');
    });
  });

  describe('householdTotal', () => {
    const selectedProperty = {
      source_id: 'test/selected/property/latest',
      name: 'households',
      label: 'Test Property',
      description: 'Test Property Description',
      source: 'https://test.com',
    };

    it('returns total of households for all features', () => {
      const clickedFeatures = [
        { object: { properties: { households: 7 } } },
        { object: { properties: { households: 10 } } },
        { object: { properties: { households: 12 } } },
      ];

      const { result } = renderContext({ clickedFeatures, selectedProperty });
      expect(result.current.householdTotal).toEqual('29');
    });
  });

  describe('areaValue', () => {
    it('returns areaValue calculated from property and features', () => {
      const { result } = renderContext({
        clickedFeatures: [
          {
            object: {
              properties: {
                '% of people aged 0-17': 12,
              },
            },
          },
          {
            object: {
              properties: {
                '% of people aged 0-17': 15,
              },
            },
          },
        ],
        selectedProperty: {
          name: '% of people aged 0-17',
        },
      });
      expect(result.current.areaValue).toEqual(27);
    });
  });

  describe('breakdownAggregation', () => {
    it('returns undefined if selectedProperty is undefined', () => {
      const { result } = renderContext({});
      expect(result.current.breakdownAggregation).toBeUndefined();
    });
    it('returns undefined if selectedProperty.breakdown is undefined', () => {
      const { result } = renderContext({
        selectedProperty: {
          source_id: 'test/layer',
          name: 'hello',
        },
      });
      expect(result.current.breakdownAggregation).toBeUndefined();
    });

    it('returns the property breakdown values', () => {
      const source_id = 'test/source',
        currentSource = {
          source_id,
          metadata: {
            properties: [
              { name: '% of people aged 0-17' },
              { name: '% of people aged 18-39' },
            ],
          },
        },
        selectedProperty = {
          name: '% of people aged 0-17',
          source_id,
          aggregation: 'sum',
          precision: 1,
          breakdown: ['% of people aged 0-17', '% of people aged 18-39'],
        },
        clickedFeatures = [
          {
            object: {
              properties: {
                '% of people aged 0-17': 2,
                '% of people aged 18-39': 4,
              },
            },
          },
          {
            object: {
              properties: {
                '% of people aged 0-17': 5,
                '% of people aged 18-39': 9,
              },
            },
          },
        ],
        expected = [
          { value: 7, name: '% of people aged 0-17' },
          { value: 13, name: '% of people aged 18-39' },
        ];

      const { result } = renderContext({
        currentSource,
        selectedProperty,
        clickedFeatures,
      });

      expect(result.current.breakdownAggregation).toEqual(expected);
    });

    describe('timeseries', () => {
      const name1 = 'people in 0-17',
        name2 = 'people in 18-39',
        timeseries_latest_timestamp = '2020-02-01T00:00:00Z',
        selectedTimestamp = '2020-02-03T00:00:00Z',
        selectedTime = new Date(selectedTimestamp).getTime(),
        source_id = 'test/source',
        currentSource = {
          source_id,
          metadata: {
            properties: [
              {
                name: name1,
                timeseries: true,
                timeseries_latest_timestamp,
                breakdown: [name1, name2],
              },
              {
                name: name2,
                timeseries: true,
                timeseries_latest_timestamp: timeseries_latest_timestamp,
              },
            ],
          },
        },
        selectedProperty = {
          source_id,
          ...currentSource.metadata.properties[0],
        },
        clickedFeatures = [
          {
            object: {
              properties: {
                [name1]: [
                  { timestamp: selectedTimestamp, value: 68745 },
                  { timestamp: timeseries_latest_timestamp, value: 20 },
                ],
                [name2]: [
                  { timestamp: selectedTimestamp, value: 98784 },
                  { timestamp: timeseries_latest_timestamp, value: 4 },
                ],
              },
            },
          },
          {
            object: {
              properties: {
                [name1]: [
                  { timestamp: selectedTimestamp, value: 84354 },
                  { timestamp: timeseries_latest_timestamp, value: 3 },
                ],
                [name2]: [
                  { timestamp: selectedTimestamp, value: 35456 },
                  { timestamp: timeseries_latest_timestamp, value: 1 },
                ],
              },
            },
          },
        ];
      it('Returns the breakdown aggregated by latest timestamp if the property is timeseries', () => {
        const { result } = renderContext({
          currentSource,
          selectedProperty,
          clickedFeatures,
        });
        expect(result.current.breakdownAggregation).toEqual([
          { value: 23, name: name1 },
          { value: 5, name: name2 },
        ]);
      });

      it('Returns the breakdown aggregated by the chosen timestamp if one is selected', () => {
        const { result } = renderContext({
          currentSource,
          selectedProperty,
          clickedFeatures,
          selectedTimestamp: selectedTime,
        });
        expect(result.current.breakdownAggregation).toEqual([
          { value: 68745 + 84354, name: name1 },
          { value: 98784 + 35456, name: name2 },
        ]);
      });

      it('Works if a property used for breakdown is not listed in metadata', () => {
        const { result } = renderContext({
          currentSource: {
            ...currentSource,
            metadata: {
              ...currentSource.metadata,
              properties: [currentSource.metadata.properties[0]],
            },
          },
          selectedProperty,
          clickedFeatures,
        });
        expect(result.current.breakdownAggregation).toEqual([
          { value: 23, name: name1 },
          { value: 5, name: name2 },
        ]);
      });
    });

    it('Errors if latest timestamps are not matching between breakdown properties', () => {
      const name1 = 'people in 0-17',
        name2 = 'people in 18-39',
        timestamp1 = '2020-01-01T00:00:00Z',
        timestamp2 = '2020-02-01T00:00:00Z',
        source_id = 'test/source',
        property1 = {
          source_id,
          name: name1,
          breakdown: [name1, name2],
          timeseries: true,
          timeseries_latest_timestamp: timestamp1,
        },
        currentSource = {
          source_id,
          metadata: {
            properties: [
              property1,
              {
                name: name2,
                timeseries: true,
                timeseries_latest_timestamp: timestamp2,
              },
            ],
          },
        },
        selectedProperty = {
          source_id,
          name: name1,
          breakdown: [name1, name2],
          timeseries: true,
          timeseries_latest_timestamp: timestamp1,
        },
        clickedFeatures = [
          {
            object: {
              properties: {
                [name1]: [{ timestamp: timestamp1, value: 20 }],
                [name2]: [{ timestamp: timestamp2, value: 4 }],
              },
            },
          },
          {
            object: {
              properties: {
                [name1]: [{ timestamp: timestamp1, value: 3 }],
                [name2]: [{ timestamp: timestamp2, value: 1 }],
              },
            },
          },
        ];

      console.error = jest.fn();

      const { result } = renderContext({
        currentSource,
        selectedProperty,
        clickedFeatures,
      });
      expect(console.error).toHaveBeenCalled();
      expect(result.current.breakdownAggregation).toEqual([
        { name: name1, value: 23 },
        { name: name2, value: 5 },
      ]);
    });
  });
});
