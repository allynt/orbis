import { FlyToInterpolator } from 'deck.gl';
import { LAYER_IDS, MAX_ZOOM } from 'map/map.constants';
import { useMap } from 'MapContext';
import { useDispatch } from 'react-redux';
import { easeInOutCubic } from 'utils/easingFunctions';
import { setPickedObjects } from './action-for-help.slice';
import { infrastructureLayer } from './infrastructure-layer';
import { peopleLayer } from './people-layer';

const INFRASTRUCTURE_LAYER_IDS = [
  LAYER_IDS.astrosat.hourglass.scotlandInfrastructure.v1,
  LAYER_IDS.astrosat.hourglass.walesInfrastructure.v1,
  LAYER_IDS.astrosat.hourglass.northernIrelandInfrastructure.v1,
];

const PEOPLE_LAYER_IDS = [
  LAYER_IDS.astrosat.covid.hourglass.latest,
  LAYER_IDS.astrosat.covid.commonWeal.latest,
];

export const useActionForHelpOrb = (data, activeSources) => {
  const { setViewState } = useMap();
  const dispatch = useDispatch();

  const handleLayerClick = info => {
    if (info.object.properties.cluster) {
      if (info.object.properties.expansion_zoom <= MAX_ZOOM)
        setViewState({
          longitude: info.object.geometry.coordinates[0],
          latitude: info.object.geometry.coordinates[1],
          zoom:
            info.object.properties.expansion_zoom >= MAX_ZOOM
              ? MAX_ZOOM
              : info.object.properties.expansion_zoom,
          transitionDuration: 1000,
          transitionEasing: easeInOutCubic,
          transitionInterpolator: new FlyToInterpolator(),
        });
      else dispatch(setPickedObjects(info.objects));
    } else dispatch(setPickedObjects([info.object]));
  };

  const layers = [
    ...INFRASTRUCTURE_LAYER_IDS.map(id =>
      infrastructureLayer({
        id,
        data: data[id],
        visible: !!activeSources?.find(source => source.source_id === id),
        onClick: handleLayerClick,
      }),
    ),
    ...PEOPLE_LAYER_IDS.map(id =>
      peopleLayer({
        id,
        data: data[id],
        visible: !!activeSources?.find(source => source.source_id === id),
        onClick: handleLayerClick,
      }),
    ),
  ];

  return {
    layers,
  };
};
useActionForHelpOrb.id = 'hourglass';
