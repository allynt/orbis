import { sumBy } from 'lodash';
import React, { createContext, useMemo } from 'react';
import { aggregateValues } from './aggregateValues';

/**
 * @typedef AnalysisPanelContextType
 * @property {string[]} [areasOfInterest]
 * @property {string} [populationTotal]
 * @property {string} [householdTotal]
 * @property {number} [areaValue]
 */

/** @type {React.Context<AnalysisPanelContextType>} */
export const AnalysisPanelContext = createContext(undefined);
AnalysisPanelContext.displayName = 'AnalysisPanelContext';

/**
 * @param {{
 *  clickedFeatures: import('typings/orbis').PolygonPickedMapFeature[]
 *  selectedProperty: import('typings/orbis').Property & {source_id: string}
 *  children: React.ReactNode
 * }} props
 */
export const AnalysisPanelProvider = ({
  clickedFeatures,
  selectedProperty,
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
    () => aggregateValues(clickedFeatures, selectedProperty),
    [clickedFeatures, selectedProperty],
  );

  return (
    <AnalysisPanelContext.Provider
      value={{ areasOfInterest, populationTotal, householdTotal, areaValue }}
    >
      {children}
    </AnalysisPanelContext.Provider>
  );
};
