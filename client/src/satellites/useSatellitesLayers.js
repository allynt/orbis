import { useEffect, useState } from 'react';

import { DataFilterExtension } from '@deck.gl/extensions';
import { TileLayer } from '@deck.gl/geo-layers';
import { GeoJsonLayer } from '@deck.gl/layers';
import { DrawRectangleMode, ViewMode } from '@nebula.gl/edit-modes';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { feature, featureCollection, geometry } from '@turf/turf';
import { useDispatch, useSelector } from 'react-redux';

import { baseSatelliteImageConfig } from 'map/orbs/configurations/satelliteImageConfig';
import { COLOR_PRIMARY_ARRAY } from 'utils/color';

import { Panels } from './satellite.constants';
import {
  aoiSelector,
  cloudCoverPercentageSelector,
  hoveredSceneSelector,
  isDrawingAoiSelector,
  scenesSelector,
  selectedSceneLayerVisibleSelector,
  selectedSceneSelector,
  selectScene,
  setAoi,
  setHoveredScene,
  setIsDrawingAoi,
  visiblePanelSelector,
  visualisationIdSelector,
} from './satellites.slice';

export const useSatellitesLayers = () => {
  /** @type {[undefined | string[], React.Dispatch<undefined | string[]>]} */
  const [selectedSceneTiles, setSelectedSceneTiles] = useState();
  const dispatch = useDispatch();
  const scenes = useSelector(scenesSelector);
  const hoveredScene = useSelector(hoveredSceneSelector);
  const selectedScene = useSelector(selectedSceneSelector);
  const visualisationId = useSelector(visualisationIdSelector);
  const isDrawingAoi = useSelector(isDrawingAoiSelector);
  const cloudCoverPercentage = useSelector(cloudCoverPercentageSelector);
  const selectedSceneLayerVisible = useSelector(
    selectedSceneLayerVisibleSelector,
  );
  const visiblePanel = useSelector(visiblePanelSelector);
  const aoi = useSelector(aoiSelector);

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
    if (aoi?.length >= 1) dispatch(setAoi(undefined));
    if (editType !== 'addFeature') return;
    dispatch(setAoi(updatedData.features[0].geometry.coordinates[0]));
    dispatch(setIsDrawingAoi(false));
  };

  const getFillColor = [0, 0, 0, 0];
  const getLineColor = COLOR_PRIMARY_ARRAY;

  // @ts-ignore
  const drawAoiLayer = new EditableGeoJsonLayer({
    id: 'draw-aoi-layer',
    data: featureCollection(aoi ? [feature(geometry('Polygon', [aoi]))] : []),
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
   *  import('typings/satellites').Scene
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
    extensions: [
      new DataFilterExtension({
        filterSize: 1,
      }),
    ],
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

  return {
    drawAoiLayer: isDrawingAoi || !!aoi ? drawAoiLayer : undefined,
    scenesLayer,
    selectedSceneLayer,
  };
};
