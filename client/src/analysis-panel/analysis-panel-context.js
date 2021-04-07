import { find, sumBy } from 'lodash';
import React, { createContext, useContext, useMemo } from 'react';
import { aggregateValues } from './aggregateValues';

/**
 * @typedef AnalysisPanelContextType
 * @property {string[]} [areasOfInterest]
 * @property {string} [populationTotal]
 * @property {string} [householdTotal]
 * @property {number} [areaValue]
 * @property {{name: string, value: number}[]} [breakdownAggregation]
 */

/** @type {React.Context<AnalysisPanelContextType>} */
export const AnalysisPanelContext = createContext(undefined);
AnalysisPanelContext.displayName = 'AnalysisPanelContext';

/**
 * @param {{
 *  clickedFeatures: import('typings/orbis').PolygonPickedMapFeature[]
 *  currentSource: import('typings/orbis').Source
 *  selectedProperty: import('typings/orbis').Property & {source_id: string}
 *  selectedTimestamp?: string
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
  console.log(selectedTimestamp);
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

  const breakdownAggregation = useMemo(
    () =>
      selectedProperty?.breakdown
        ?.map(breakdownPropertyName => {
          const breakdownProperty = find(currentSource?.metadata?.properties, {
            name: breakdownPropertyName,
          });
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
            breakdownProperty ?? {
              ...selectedProperty,
              name: breakdownPropertyName,
            },
            selectedTimestamp,
          );
          return {
            value,
            name: breakdownPropertyName,
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
