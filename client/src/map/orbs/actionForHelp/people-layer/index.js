import { GeoJsonClusteredIconLayer } from 'map/deck.gl/custom-layers/geo-json-clustered-icon-layer';
import iconAtlas from './iconAtlas.svg';
import iconMapping from './iconMapping.json';

export const peopleLayer = ({ id, data, visible, onClick }) =>
  new GeoJsonClusteredIconLayer({
    id,
    data,
    visible,
    pickable: true,
    iconAtlas,
    iconMapping,
    getIcon: feature => feature.properties.Type,
    getIconSize: 15,
    onClick,
  });
