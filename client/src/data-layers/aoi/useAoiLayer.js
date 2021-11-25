import { useEffect, useState } from 'react';

import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { featureCollection } from '@turf/turf';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { Panels } from 'data-layers/data-layers.constants';
import { COLOR_PRIMARY_ARRAY } from 'utils/color';

import {
  aoiSelector,
  setAoiFeatures,
  isDrawingAoiSelector,
  visiblePanelSelector,
} from './aoi.slice';
import { DRAW_MODE_MAP } from './toolbox/aoi-toolbox.constants';

export const useAoiLayer = ({
  defaultSelectedFeatureIndexes = [],
  defaultAoiDrawMode = 'ViewMode',
} = {}) => {
  const dispatch = useDispatch();

  const [aoiDrawMode, setAoiDrawMode] = useState(defaultAoiDrawMode);

  const isDrawingAoi = useSelector(isDrawingAoiSelector);
  const visiblePanel = useSelector(visiblePanelSelector);
  const aoi = useSelector(aoiSelector);
  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState(
    defaultSelectedFeatureIndexes,
  );

  useEffect(() => {
    if (!isDrawingAoi) {
      setSelectedFeatureIndexes([]);
      setAoiDrawMode('ViewMode');
    }
  }, [isDrawingAoi]);

  const onEdit = ({ updatedData }) => dispatch(setAoiFeatures(updatedData));

  const onClick = ({ index }) => {
    if (!isDrawingAoi) {
      return;
    }

    setSelectedFeatureIndexes([index]);
  };

  const getFillColor = [128, 128, 128, 1];
  const getLineColor = COLOR_PRIMARY_ARRAY;

  const drawAoiLayer = new EditableGeoJsonLayer({
    id: 'draw-aoi-layer',
    data: featureCollection(aoi ? [aoi] : []),
    visible: visiblePanel === Panels.AOI,
    mode: get(DRAW_MODE_MAP, aoiDrawMode),
    selectedFeatureIndexes,
    onEdit,
    onClick,
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
