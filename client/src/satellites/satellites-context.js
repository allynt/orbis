import React, { createContext, useContext, useEffect, useState } from 'react';

import { GeoJsonLayer } from '@deck.gl/layers';
import { DrawRectangleMode, ViewMode } from '@nebula.gl/edit-modes';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { feature, featureCollection } from '@turf/turf';
import { useSelector } from 'react-redux';

import { COLOR_PRIMARY_ARRAY } from 'utils/color';

import { scenesSelector } from './satellites.slice';

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
  const scenes = useSelector(scenesSelector);

  const onEdit = ({ editType, updatedData }) => {
    if (features.length >= 1) setFeatures([]);
    if (editType !== 'addFeature') return;
    setFeatures(updatedData.features);
    setIsDrawingAoi(false);
  };

  const getFillColor = [0, 0, 0, 0];
  const getLineColor = COLOR_PRIMARY_ARRAY;

  // @ts-ignore
  const drawAoiLayer = new EditableGeoJsonLayer({
    id: 'draw-aoi-layer',
    data: featureCollection(features),
    mode: isDrawingAoi ? DrawRectangleMode : ViewMode,
    selectedFeatureIndexes: [],
    onEdit,
    getFillColor,
    getTentativeFillColor: getFillColor,
    getLineColor,
    getTentativeLineColor: getLineColor,
  });

  const scenesLayer = new GeoJsonLayer({
    id: 'scenes-layer',
    pickable: true,
    autoHighlight: true,
    getFillColor: [53, 149, 243, 255 * 0.5],
    data:
      scenes &&
      featureCollection(
        scenes
          ?.map(scene => scene.footprint)
          .map(footprint => feature(footprint)),
      ),
  });

  return (
    <SatellitesContext.Provider
      value={{
        isDrawingAoi,
        setIsDrawingAoi,
        drawAoiLayer: isDrawingAoi || !!features[0] ? drawAoiLayer : undefined,
        aoi: features[0]?.geometry.coordinates[0],
        scenesLayer,
      }}
    >
      {children}
    </SatellitesContext.Provider>
  );
};

export const useSatellites = () => useContext(SatellitesContext);
