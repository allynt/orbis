import { GeoJsonClusteredIconLayer } from 'map/deck.gl/custom-layers/geo-json-clustered-icon-layer';
import iconMapping from './iconMapping.json';
import iconAtlas from './iconAtlas.svg';

export const infrastructureLayer = ({ id, data, visible, onClick }) =>
  new GeoJsonClusteredIconLayer({
    id,
    data,
    visible,
    pickable: true,
    iconMapping,
    iconAtlas,
    getIcon: feature => feature.properties.type,
    onClick,
  });
