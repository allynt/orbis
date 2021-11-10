import { useEffect, useState } from 'react';

import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { feature, featureCollection, geometry } from '@turf/turf';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { Panels } from 'data-layers/data-layers.constants';
import { COLOR_PRIMARY_ARRAY } from 'utils/color';

import {
  aoiSelector,
  endDrawingAoi,
  isDrawingAoiSelector,
  visiblePanelSelector,
} from './aoi.slice';
import { DRAW_MODE_MAP } from './toolbox/aoi-toolbox.constants';

export const useAoiLayer = ({ defaultAoiDrawMode = 'ViewMode' } = {}) => {
  const dispatch = useDispatch();

  const [aoiDrawMode, setAoiDrawMode] = useState(defaultAoiDrawMode);

  const isDrawingAoi = useSelector(isDrawingAoiSelector);
  const visiblePanel = useSelector(visiblePanelSelector);
  const aoi = useSelector(aoiSelector);

  useEffect(() => {
    if (!isDrawingAoi) {
      setAoiDrawMode('ViewMode');
    }
  }, [isDrawingAoi]);

  const onEdit = ({ editType, updatedData }) => {
    if (editType !== 'addFeature') return;
    dispatch(endDrawingAoi(updatedData.features[0].geometry.coordinates[0]));
  };

  const getFillColor = [0, 0, 0, 0];
  const getLineColor = COLOR_PRIMARY_ARRAY;

  const drawAoiLayer = new EditableGeoJsonLayer({
    id: 'draw-aoi-layer',
    data: featureCollection(aoi ? [feature(geometry('Polygon', [aoi]))] : []),
    visible: visiblePanel === Panels.AOI,
    mode: get(DRAW_MODE_MAP, aoiDrawMode),
    selectedFeatureIndexes: [],
    onEdit,
    getFillColor,
    getTentativeFillColor: getFillColor,
    getLineColor,
    getTentativeLineColor: getLineColor,
  });

  return {
    drawAoiLayer,
    isDrawingAoi,
    aoiDrawMode,
    setAoiDrawMode,
  };
};
