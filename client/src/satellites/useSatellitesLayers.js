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
  satelliteAoiSelector,
  cloudCoverPercentageSelector,
  endDrawingSatelliteAoi,
  hoveredSceneSelector,
  isDrawingSatelliteAoiSelector,
  scenesSelector,
  selectedSceneLayerVisibleSelector,
  selectedSceneSelector,
  selectScene,
  setHoveredScene,
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
  const isDrawingAoi = useSelector(isDrawingSatelliteAoiSelector);
  const cloudCoverPercentage = useSelector(cloudCoverPercentageSelector);
  const selectedSceneLayerVisible = useSelector(
    selectedSceneLayerVisibleSelector,
  );
  const visiblePanel = useSelector(visiblePanelSelector);
  const aoi = useSelector(satelliteAoiSelector);

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
    if (editType !== 'addFeature') return;
    dispatch(
      endDrawingSatelliteAoi(updatedData.features[0].geometry.coordinates[0]),
    );
  };

  const getFillColor = [0, 0, 0, 0];
  const getLineColor = COLOR_PRIMARY_ARRAY;

  // @ts-ignore
  const drawAoiLayer = new EditableGeoJsonLayer({
    id: 'draw-satellite-aoi-layer',
    data: featureCollection(aoi ? [feature(geometry('Polygon', [aoi]))] : []),
    visible: visiblePanel === Panels.SEARCH || visiblePanel === Panels.RESULTS,
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
      data: selectedSceneTiles,
      visible:
        selectedSceneLayerVisible && visiblePanel === Panels.VISUALISATION,
    }),
  );

  return {
    drawSatelliteAoiLayer: isDrawingAoi || !!aoi ? drawAoiLayer : undefined,
    scenesLayer,
    selectedSceneLayer,
  };
};
