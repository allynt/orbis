import React, { createContext, useContext, useEffect, useState } from 'react';

import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer, GeoJsonLayer } from '@deck.gl/layers';
import { DrawRectangleMode, ViewMode } from '@nebula.gl/edit-modes';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { feature, featureCollection } from '@turf/turf';
import { useSelector } from 'react-redux';

import { COLOR_PRIMARY_ARRAY } from 'utils/color';

import {
  scenesSelector,
  selectedSceneSelector,
  visualisationIdSelector,
} from './satellites.slice';

/**
 * @typedef {{
 *  isDrawingAoi: boolean
 *  setIsDrawingAoi: React.Dispatch<React.SetStateAction<boolean>>
 *  drawAoiLayer?: EditableGeoJsonLayer
 *  aoi?: number[][]
 *  scenesLayer?: GeoJsonLayer
 * }} SatellitesContextType
 */

/** @type {React.Context<SatellitesContextType>} */
const SatellitesContext = createContext(undefined);
SatellitesContext.displayName = 'SatellitesContext';

/**
 * @typedef {{
 *  defaultIsDrawingAoi?: boolean
 *  defaultFeatures?: import('@turf/turf').Feature[]
 *  children: React.ReactNode
 * }} SatellitesProviderProps
 */

/**
 * @param {SatellitesProviderProps} props
 */
export const SatellitesProvider = ({
  defaultIsDrawingAoi = false,
  defaultFeatures = [],
  children,
}) => {
  const [isDrawingAoi, setIsDrawingAoi] = useState(defaultIsDrawingAoi);
  const [features, setFeatures] = useState(defaultFeatures);
  const [selectedSceneTiles, setSelectedSceneTiles] = useState();
  const scenes = useSelector(scenesSelector);
  const selectedScene = useSelector(selectedSceneSelector);
  const visualisationId = useSelector(visualisationIdSelector);

  useEffect(() => {
    const update = async () => {
      if (selectedScene) {
        const tileJsonResponse = await fetch(
          selectedScene?.tile_url.replace(
            '{VISUALISATION_ID}',
            visualisationId,
          ),
        );
        console.log('response');
        const tileJson = await tileJsonResponse.json();
        setSelectedSceneTiles(tileJson.tiles);
      }
    };
    update();
  }, [selectedScene, visualisationId]);

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
        scenes?.map(scene => scene.footprint && feature(scene.footprint)),
      ),
  });

  const selectedSceneLayer = new TileLayer({
    // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
    // data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
    data: selectedSceneTiles?.map(tile => tile.replace('testing', 'staging')),
    tileSize: 256,
    renderSubLayers: props => {
      const {
        bbox: { west, south, east, north },
      } = props.tile;
      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north],
      });
    },
  });

  return (
    <SatellitesContext.Provider
      value={{
        isDrawingAoi,
        setIsDrawingAoi,
        drawAoiLayer: isDrawingAoi || !!features[0] ? drawAoiLayer : undefined,
        aoi: features[0]?.geometry.coordinates[0],
        scenesLayer,
        selectedSceneLayer,
      }}
    >
      {children}
    </SatellitesContext.Provider>
  );
};

export const useSatellites = () => useContext(SatellitesContext);
