import React, { createContext, useContext, useMemo } from 'react';

import { find, sumBy } from 'lodash';

import { aggregateValues } from './aggregateValues';

/**
 * @typedef AnalysisPanelContextType
 * @property {string[]} [areasOfInterest]
 * @property {string} [populationTotal]
 * @property {string} [householdTotal]
 * @property {number} [areaValue]
 * @property {number} [meanAreaValue]
 * @property {{name: string, value: number}[]} [breakdownAggregation]
 */

/** @type {React.Context<AnalysisPanelContextType>} */
export const AnalysisPanelContext = createContext(undefined);
AnalysisPanelContext.displayName = 'AnalysisPanelContext';

/**
 * @param {{
 *  clickedFeatures: import('typings').PolygonPickedMapFeature[]
 *  currentSource: import('typings').Source
 *  selectedProperty: import('typings').Property & {source_id: string}
 *  selectedTimestamp?: number
 *  children: React.ReactNode
 * }} props
 */
export const AnalysisPanelProvider = ({
  clickedFeatures,
  currentSource,
  selectedProperty,
  selectedTimestamp,
  children,
}) => {
  const areasOfInterest = useMemo(() => {
    const areas = clickedFeatures?.map(
      feat => feat.object.properties.area_name,
    );
    return areas?.some(a => a !== undefined) ? areas : undefined;
  }, [clickedFeatures]);

  const populationTotal = useMemo(
    () =>
      sumBy(clickedFeatures, 'object.properties.population')?.toLocaleString(),
    [clickedFeatures],
  );

  const householdTotal = useMemo(
    () =>
      sumBy(clickedFeatures, 'object.properties.households')?.toLocaleString(),
    [clickedFeatures],
  );

  const areaValue = useMemo(
    () => aggregateValues(clickedFeatures, selectedProperty, selectedTimestamp),
    [clickedFeatures, selectedProperty, selectedTimestamp],
  );

  const meanAreaValue = useMemo(() => {
    if (selectedProperty?.aggregation === 'mean') return areaValue;
    return aggregateValues(
      clickedFeatures,
      { ...selectedProperty, aggregation: 'mean' },
      selectedTimestamp,
    );
  }, [areaValue, clickedFeatures, selectedProperty, selectedTimestamp]);

  const breakdownAggregation = useMemo(
    () =>
      selectedProperty?.breakdown
        ?.map(breakdownPropertyName => {
          const breakdownProperty = find(currentSource?.metadata?.properties, {
            name: breakdownPropertyName,
          }) ?? {
            ...selectedProperty,
            name: breakdownPropertyName,
          };
          if (
            selectedProperty.timeseries &&
            breakdownProperty.timeseries_latest_timestamp !==
              selectedProperty.timeseries_latest_timestamp
          ) {
            console.error(
              `Latest timestamp for property ${breakdownPropertyName} and ${selectedProperty.name} do not match`,
            );
          }
          const value = aggregateValues(
            clickedFeatures,
            breakdownProperty,
            selectedTimestamp,
          );
          return {
            value,
            name: breakdownPropertyName.substring(
              breakdownPropertyName.indexOf('|') + 1,
              breakdownPropertyName.length,
            ),
          };
        })
        .filter(v => v.value > 0),
    [clickedFeatures, currentSource, selectedProperty, selectedTimestamp],
  );

  return (
    <AnalysisPanelContext.Provider
      value={{
        areasOfInterest,
        populationTotal,
        householdTotal,
        areaValue,
        meanAreaValue,
        breakdownAggregation,
      }}
    >
      {children}
    </AnalysisPanelContext.Provider>
  );
};

export const useAnalysisPanelContext = () => {
  const context = useContext(AnalysisPanelContext);
  return context;
};
