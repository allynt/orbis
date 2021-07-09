import React, { createContext, useContext, useState } from 'react';

import { DrawRectangleMode } from '@nebula.gl/edit-modes';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { featureCollection } from '@turf/turf';

/**
 * @typedef {{
 *  isDrawingAoi: boolean
 *  setIsDrawingAoi: React.Dispatch<React.SetStateAction<boolean>>
 *  drawAoiLayer?: EditableGeoJsonLayer
 *  aoi?: number[][]
 * }} SatellitesContextType
 */

/** @type {React.Context<SatellitesContextType>} */
const SatellitesContext = createContext(undefined);
SatellitesContext.displayName = 'SatellitesContext';

/**
 * @typedef {{
 *  defaultIsDrawingAoi?: boolean
 *  children: React.ReactNode
 * }} SatellitesProviderProps
 */

/**
 * @param {SatellitesProviderProps} props
 */
export const SatellitesProvider = ({
  defaultIsDrawingAoi = false,
  children,
}) => {
  const [isDrawingAoi, setIsDrawingAoi] = useState(defaultIsDrawingAoi);
  const [features, setFeatures] = useState([]);

  const onEdit = ({ editType, updatedData }) => {
    if (features.length >= 1) setFeatures([]);
    if (editType !== 'addFeature') return;
    setFeatures(updatedData.features);
  };

  // This needs to be visible when drawing AOI but also after its been drawn but not when there's results
  // and not when satellites isn't visible. BUT! if it's triggered again it does need to show, even if there is results
  // @ts-ignore
  const drawAoiLayer = new EditableGeoJsonLayer({
    id: 'draw-aoi-layer',
    data: featureCollection(features),
    mode: DrawRectangleMode,
    selectedFeatureIndexes: [],
    onEdit,
  });

  return (
    <SatellitesContext.Provider
      value={{
        isDrawingAoi,
        setIsDrawingAoi,
        drawAoiLayer: isDrawingAoi ? drawAoiLayer : undefined,
        aoi: features[0]?.geometry.coordinates[0],
      }}
    >
      {children}
    </SatellitesContext.Provider>
  );
};

export const useSatellites = () => useContext(SatellitesContext);
