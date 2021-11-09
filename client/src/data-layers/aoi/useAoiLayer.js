import { DrawRectangleMode, ViewMode } from '@nebula.gl/edit-modes';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { feature, featureCollection, geometry } from '@turf/turf';
import { useDispatch, useSelector } from 'react-redux';

import { Panels } from 'data-layers/data-layers.constants';
import { COLOR_PRIMARY_ARRAY } from 'utils/color';

import {
  aoiSelector,
  endDrawingAoi,
  isDrawingAoiSelector,
  visiblePanelSelector,
} from './aoi.slice';

export const useAoiLayer = () => {
  const dispatch = useDispatch();

  const isDrawingAoi = useSelector(isDrawingAoiSelector);
  const visiblePanel = useSelector(visiblePanelSelector);
  const aoi = useSelector(aoiSelector);

  const onEdit = ({ editType, updatedData }) => {
    if (editType !== 'addFeature') return;
    dispatch(endDrawingAoi(updatedData.features[0].geometry.coordinates[0]));
  };

  const getFillColor = [0, 0, 0, 0];
  const getLineColor = COLOR_PRIMARY_ARRAY;

  const drawAoiLayer = new EditableGeoJsonLayer({
    id: 'draw-aoi-layer',
    data: featureCollection(aoi ? [feature(geometry('Polygon', [aoi]))] : []),
    visible: visiblePanel === Panels.DATA_LAYERS || visiblePanel === Panels.AOI,
    mode: isDrawingAoi ? DrawRectangleMode : ViewMode,
    selectedFeatureIndexes: [],
    onEdit,
    getFillColor,
    getTentativeFillColor: getFillColor,
    getLineColor,
    getTentativeLineColor: getLineColor,
  });

  return {
    drawAoiLayer: isDrawingAoi || !!aoi ? drawAoiLayer : undefined,
  };
};
