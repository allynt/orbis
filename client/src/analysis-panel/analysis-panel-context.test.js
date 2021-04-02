import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import {
  AnalysisPanelProvider,
  useAnalysisPanelContext,
} from './analysis-panel-context';

const renderContext = ({
  clickedFeatures = undefined,
  selectedProperty = undefined,
  currentSource = undefined,
} = {}) =>
  renderHook(() => useAnalysisPanelContext(), {
    wrapper: ({ children }) => (
      <AnalysisPanelProvider
        clickedFeatures={clickedFeatures}
        currentSource={currentSource}
        selectedProperty={selectedProperty}
      >
        {children}
      </AnalysisPanelProvider>
    ),
  });

describe.only('AnalysisPanelContext', () => {
  describe('areasOfInterest', () => {
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
      const { result } = renderContext({ clickedFeatures });
      expect(result.current.areasOfInterest).toEqual(expected);
    });

    it('returns undefined if no features have an `area_name` property', () => {
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
      });
      expect(result.current.areasOfInterest).toBeUndefined();
    });
  });

  describe('populationTotal', () => {
    it('returns total of population in all features', () => {
      const clickedFeatures = [
        { object: { properties: { population: 5 } } },
        { object: { properties: { population: 10 } } },
        { object: { properties: { population: 15 } } },
      ];

      const { result } = renderContext({ clickedFeatures });
      expect(result.current.populationTotal).toEqual('30');
    });
  });
});
