import { find } from 'lodash';

import { setClickedFeatures } from '../layers.slice';
import disastersIconAtlas from './disasterAlertsConfig.iconAtlas.svg';
import disastersIconMapping from './disasterAlertsConfig.iconMapping.json';

const COLORS = {
  Orange: [255, 165, 0, 50],
  Red: [255, 0, 0, 50],
  Green: [0, 255, 0, 50],
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
export default ({ id, activeSources, dispatch }) => {
  const source = find(activeSources, { source_id: id });
  const { url } = source.metadata;

  /** @param {DisasterFeature} feature */
  const getColor = feature => {
    if (feature.properties.Class.includes('Cone')) return [150, 150, 150, 150];
    if (
      ['Poly_Green', 'Poly_Orange', 'Poly_Red'].includes(
        feature.properties.Class,
      )
    )
      return COLORS[feature.properties?.Class.split('_')[1]];
    return COLORS[feature.properties?.episodealertlevel];
  };

  /** @param {DisasterFeature} feature */
  const getIcon = feature =>
    `${feature.properties.eventtype}_${feature.properties.alertlevel}`;

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
