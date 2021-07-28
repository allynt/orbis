import React, { createContext, useContext, useEffect, useState } from 'react';

import { DataFilterExtension } from '@deck.gl/extensions';
import { TileLayer } from '@deck.gl/geo-layers';
import { GeoJsonLayer } from '@deck.gl/layers';
import { DrawRectangleMode, ViewMode } from '@nebula.gl/edit-modes';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { feature, featureCollection } from '@turf/turf';
import { useDispatch, useSelector } from 'react-redux';

import { baseSatelliteImageConfig } from 'map/orbs/configurations/satelliteImageConfig';
import { COLOR_PRIMARY_ARRAY } from 'utils/color';

import { DEFAULT_CLOUD_COVER, Panels } from './satellite.constants';
import {
  hoveredSceneSelector,
  scenesSelector,
  selectedSceneSelector,
  selectScene,
  setHoveredScene,
  visualisationIdSelector,
} from './satellites.slice';

/**
 * @typedef {{
 *  isDrawingAoi: boolean
 *  setIsDrawingAoi: React.Dispatch<React.SetStateAction<boolean>>
 *  drawAoiLayer?: EditableGeoJsonLayer
 *  aoi?: number[][]
 *  scenesLayer?: GeoJsonLayer
 *  selectedSceneLayer?: TileLayer
 *  cloudCoverPercentage: number,
 *  setCloudCover: React.Dispatch<React.SetStateAction<number>>
 *  selectedSceneLayerVisible: boolean
 *  setSelectedSceneLayerVisible: React.Dispatch<React.SetStateAction<boolean>>
 *  visiblePanel: string
 *  setVisiblePanel: React.Dispatch<React.SetStateAction<string>>
 * }} SatellitesContextType
 */

/** @type {React.Context<SatellitesContextType>} */
const SatellitesContext = createContext(undefined);
SatellitesContext.displayName = 'SatellitesContext';

/**
 * @typedef {{
 *  defaultIsDrawingAoi?: boolean
 *  defaultFeatures?: import('@turf/turf').Feature[]
 *  defaultPanel?: string
 *  children: React.ReactNode
 * }} SatellitesProviderProps
 */

/**
 * @param {SatellitesProviderProps} props
 */
export const SatellitesProvider = ({
  defaultIsDrawingAoi = false,
  defaultFeatures = [],
  defaultPanel = Panels.SEARCH,
  children,
}) => {
  const [isDrawingAoi, setIsDrawingAoi] = useState(defaultIsDrawingAoi);
  const [features, setFeatures] = useState(defaultFeatures);
  /** @type {[undefined | string[], React.Dispatch<undefined | string[]>]} */
  const [selectedSceneTiles, setSelectedSceneTiles] = useState();
  const [cloudCoverPercentage, setCloudCover] = useState(DEFAULT_CLOUD_COVER);
  const [selectedSceneLayerVisible, setSelectedSceneLayerVisible] = useState(
    false,
  );
  const [visiblePanel, setVisiblePanel] = useState(defaultPanel);
  const dispatch = useDispatch();
  const scenes = useSelector(scenesSelector);
  const hoveredScene = useSelector(hoveredSceneSelector);
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
    visible: visiblePanel !== Panels.VISUALISATION,
    mode: isDrawingAoi ? DrawRectangleMode : ViewMode,
    selectedFeatureIndexes: [],
    onEdit,
    getFillColor,
    getTentativeFillColor: getFillColor,
    getLineColor,
    getTentativeLineColor: getLineColor,
  });

  /**
   * @type {GeoJsonLayer<import('@turf/turf').Feature<
   *  import('@turf/turf').Geometry,
   *  import('typings').Scene
   * >>}
   */
  const scenesLayer = new GeoJsonLayer({
    id: 'scenes-layer',
    visible: visiblePanel === Panels.RESULTS,
    pickable: true,
    autoHighlight: false,
    getFillColor: [53, 149, 243, 255 * 0.5],
    stroked: true,
    getLineColor: COLOR_PRIMARY_ARRAY,
    lineWidthUnits: 'pixels',
    getLineWidth: d => (d.properties.id === hoveredScene?.id ? 3 : 0),
    transitions: {
      getLineWidth: { duration: 75 },
    },
    data:
      scenes &&
      featureCollection(
        scenes?.map(
          scene => scene.footprint && feature(scene.footprint, scene),
        ),
      ),
    onClick: ({ object: { properties } }) => dispatch(selectScene(properties)),
    onHover: ({ object }) =>
      dispatch(setHoveredScene(object ? object.properties : undefined)),
    getFilterValue: d => d.properties.cloudCover,
    filterRange: [0, cloudCoverPercentage],
    extensions: [new DataFilterExtension({ filterSize: 1 })],
    updateTriggers: {
      getLineWidth: [hoveredScene],
    },
  });

  const selectedSceneLayer = new TileLayer(
    // @ts-ignore
    baseSatelliteImageConfig({
      id: 'selected-scene-layer',
      // 👇 This should not go into production, Fix it
      data: selectedSceneTiles?.map(tile => tile.replace('testing', 'staging')),
      visible:
        selectedSceneLayerVisible && visiblePanel === Panels.VISUALISATION,
    }),
  );

  return (
    <SatellitesContext.Provider
      value={{
        isDrawingAoi,
        setIsDrawingAoi,
        drawAoiLayer: isDrawingAoi || !!features[0] ? drawAoiLayer : undefined,
        aoi: features[0]?.geometry.coordinates[0],
        scenesLayer,
        selectedSceneLayer,
        cloudCoverPercentage,
        setCloudCover,
        selectedSceneLayerVisible,
        setSelectedSceneLayerVisible,
        visiblePanel,
        setVisiblePanel,
      }}
    >
      {children}
    </SatellitesContext.Provider>
  );
};

export const useSatellites = () => useContext(SatellitesContext);
