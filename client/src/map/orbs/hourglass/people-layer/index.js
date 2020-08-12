import { GeoJsonClusteredIconLayer } from 'map/deck.gl/custom-layers/geo-json-clustered-icon-layer';
import { MAX_ZOOM } from '../constants';
import iconAtlas from './iconAtlas.svg';
import iconMapping from './iconMapping.json';

export const TEXT_COLOR_TRANSPARENT = [0, 0, 0, 0];
export const TEXT_COLOR_VISIBLE = [51, 63, 72];

export const peopleLayer = ({ id, data, visible, onClick }) =>
  new GeoJsonClusteredIconLayer({
    id,
    data,
    visible,
    pickable: true,
    iconAtlas,
    iconMapping,
    getIcon: feature => {
      if (feature.properties.cluster) {
        return feature.properties.expansion_zoom > MAX_ZOOM
          ? 'group'
          : 'cluster';
      }
      return feature.properties.Type;
    },
    getIconSize: feature => (feature.properties.cluster ? 60 : 15),
    getIconColor: [246, 190, 0],
    getTextSize: 32,
    getTextColor: feature =>
      feature.properties.expansion_zoom > MAX_ZOOM
        ? TEXT_COLOR_TRANSPARENT
        : TEXT_COLOR_VISIBLE,
    clusterRadius: 20,
    maxZoom: MAX_ZOOM,
    onClick,
  });
