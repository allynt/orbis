import { FlyToInterpolator } from '@deck.gl/core';
import { DataFilterExtension } from '@deck.gl/extensions';
import { sub } from 'date-fns';

import { MAX_ZOOM } from 'map/map.constants';
import { easeInOutCubic } from 'utils/easingFunctions';

import {
  setClickedFeatures,
  filterValueSelector,
  dataSelector,
} from '../layers.slice';

const PIN_COLORS = {
  allowed: [170, 0, 0, 255],
  approved: [117, 183, 178, 255],
  commenced: [245, 36, 85, 255],
  completed: [138, 234, 115, 255],
  lapsed: [0, 0, 0, 255],
  'pending legacy record': [85, 0, 255, 255],
  superseded: [0, 85, 255, 255],
};

const configuration = ({ id, orbState, dispatch, setViewState }) => {
  const filterRange = filterValueSelector(id)(orbState);
  const data = dataSelector(id)(orbState);

  const getFilterValue = ({ properties }) => {
    // const date = new Date(properties.decision_date).getTime();

    const status = Number(
      !filterRange?.constructionPhase?.includes(properties?.Status),
    );

    const phase = Number(
      !filterRange?.developmentType?.includes(properties?.['Development Type']),
    );

    return [status, phase];
  };

  const onClick = info => {
    if (info.object.properties.cluster) {
      if (info.object.properties.expansion_zoom <= MAX_ZOOM) {
        setViewState({
          longitude: info.object.geometry.coordinates[0],
          latitude: info.object.geometry.coordinates[1],
          zoom: info.object.properties.expansion_zoom,
          transitionDuration: 1000,
          transitionEasing: easeInOutCubic,
          transitionInterpolator: new FlyToInterpolator(),
        });
      }
    } else {
      return dispatch(
        setClickedFeatures({ key: id, clickedFeatures: [info.object] }),
      );
    }
  };

  const getPinColor = feature => {
    let color = null;
    if (!feature.properties['cluster']) {
      color = PIN_COLORS[feature.properties['Status'].toLowerCase()];
    }

    return color;
  };

  return {
    data,
    extensions: [new DataFilterExtension({ filterSize: 2 })],
    getFilterValue,
    filterRange: [
      [1, 1],
      [1, 1],
    ],
    updateTriggers: {
      getFilterValue: [filterRange],
    },
    pointType: 'icon',
    getPinColor,
    getIconSize: 60,
    pickable: true,
    onClick,
  };
};

export default configuration;
