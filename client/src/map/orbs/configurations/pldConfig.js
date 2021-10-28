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
import iconAtlas from './pldConfig.iconAtlas.svg';
import iconMapping from './pldConfig.iconMapping.json';

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

  // const dateRange = [
  //   new Date(filterRange?.dateRange?.startDate).getTime() ||
  //     sub(Date.now(), { years: 10 }).getTime(),
  //   new Date(filterRange?.dateRange?.endDate).getTime() || Date.now(),
  // ];

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
    iconAtlas,
    iconMapping,
    getIconSize: 60,
    pickable: true,
    onClick,
  };
};

export default configuration;
