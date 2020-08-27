import { GeoJsonClusteredIconLayer } from 'map/deck.gl/custom-layers/geo-json-clustered-icon-layer';
import iconMapping from './iconMapping.json';
import iconAtlas from './iconAtlas.svg';

import { LAYER_IDS, MAX_ZOOM } from 'map/map.constants';

export const useMySupplyLynkOrb = (data, activeSources) => {
  const SUPPLYLYNK_LAYER_IDS = [LAYER_IDS.astrosat.mySupplyLynk.latest];

  const handleLayerClick = () => console.log('CLICKED!');

  const layers = [
    ...SUPPLYLYNK_LAYER_IDS.map(
      id =>
        new GeoJsonClusteredIconLayer({
          id,
          data: data[id],
          visible: true,
          pickable: true,
          iconMapping,
          iconAtlas,
          getIcon: feature => (feature.properties.cluster ? 'cluster' : 'pin'),
          getIconSize: 60,
          getIconColor: [246, 190, 0],
          getTextSize: 32,
          getTextColor: [51, 63, 72],
          clusterRadius: 40,
          maxZoom: MAX_ZOOM,
          onClick: handleLayerClick,
        }),
    ),
  ];

  let mapComponents = [];
  let sidebarComponents = [];

  return { layers, mapComponents, sidebarComponents };
};
