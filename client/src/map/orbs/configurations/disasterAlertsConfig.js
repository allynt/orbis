import { find } from 'lodash';

import { setClickedFeatures } from '../layers.slice';
import disastersIconAtlas from './disasterAlertsConfig.iconAtlas.svg';
import disastersIconMapping from './disasterAlertsConfig.iconMapping.json';

const COLORS = {
  orange: [238, 160, 67, 100],
  red: [229, 52, 53, 100],
  green: [110, 188, 92, 100],
};

/**
 * @typedef {keyof COLORS} ColorKey
 */

/**
 * @typedef {{
 *   Class: string
 *   alertlevel: string
 *   episodealertlevel: ColorKey
 *   icon: string
 *   name: string
 *   eventtype: 'DR' | 'WF' | 'TC' | 'FL' | 'VO'
 * }} DisasterFeatureProperties
 */

/**
 * @typedef {import('@turf/turf').Feature<
 *  import('@turf/turf').Geometries,
 *  DisasterFeatureProperties
 * >} DisasterFeature
 */

/**
 * @type {import('typings').LayerConfiguration}
 */
const Config = ({ id, activeSources, dispatch }) => {
  const source = find(activeSources, { source_id: id });
  const { url } = source.metadata;

  /** @param {DisasterFeature} feature */
  const getColor = feature => {
    if (feature.properties.Class.includes('Cone')) return [150, 150, 150, 100];
    if (
      ['Poly_Green', 'Poly_Orange', 'Poly_Red'].includes(
        feature.properties.Class,
      )
    )
      return COLORS[feature.properties?.Class.split('_')[1].toLowerCase()];
    return COLORS[feature.properties?.episodealertlevel.toLowerCase()];
  };

  /** @param {DisasterFeature} feature */
  const getIcon = feature =>
    `${feature.properties.eventtype}_${feature.properties.alertlevel}`.toLowerCase();

  /** @param {import('typings').PickedMapFeature<DisasterFeatureProperties>} pickedInfo */
  const onClick = pickedInfo => {
    dispatch(
      setClickedFeatures({ key: id, clickedFeatures: [pickedInfo.object] }),
    );
  };

  return {
    id,
    data: url,
    pointType: 'icon',
    iconAtlas: disastersIconAtlas,
    iconMapping: disastersIconMapping,
    getIcon,
    getLineWidth: 3,
    lineWidthUnits: 'pixels',
    getIconSize: 60,
    getFillColor: getColor,
    getLineColor: getColor,
    onClick,
    _subLayerProps: {
      'points-icon': {
        pickable: true,
      },
    },
  };
};

export default Config;
