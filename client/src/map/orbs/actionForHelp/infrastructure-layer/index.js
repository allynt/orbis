import { GeoJsonClusteredIconLayer } from 'map/deck.gl/custom-layers/geo-json-clustered-icon-layer';
import iconMapping from './iconMapping.json';
import iconAtlas from './iconAtlas.svg';
import { MAX_ZOOM } from 'map/map.constants';

export const infrastructureLayer = ({ id, data, visible, onClick }) =>
  new GeoJsonClusteredIconLayer({
    id,
    data,
    visible,
    pickable: true,
    iconMapping,
    iconAtlas,
    getIcon: feature =>
      feature.properties.cluster ? 'cluster' : feature.properties.type,
    getIconSize: 60,
    getIconColor: [246, 190, 0],
    getTextSize: 32,
    getTextColor: [51, 63, 72],
    clusterRadius: 40,
    maxZoom: MAX_ZOOM,
    onClick,
  });
