import React from 'react';

import { centerOfMass } from '@turf/turf';
import { useDispatch, useSelector } from 'react-redux';

import { FeatureDetail, Popup } from 'components';

import {
  clickedFeaturesSelector,
  setClickedFeatures,
  setHoveredFeatures,
  hoveredFeaturesSelector,
} from '../layers.slice';

/**
 * @param {{
 *  source: import('typings').Source
 *  titleProperty?: string
 *  picklist?: string[]
 *  omitlist?: string[]
 *  popupProps: any
 * }} props
 */
const FeatureDetailPopup = ({
  source,
  titleProperty,
  picklist,
  omitlist = [],
  popupProps,
  labelMapping,
}) => {
  const dispatch = useDispatch();

  const clickedFeatures = useSelector(state =>
    clickedFeaturesSelector(source?.source_id)(state?.orbs),
  );

  const hoveredFeatures = useSelector(state =>
    hoveredFeaturesSelector(source?.source_id)(state?.orbs),
  );

  const getDetailContent = () => {
    if (clickedFeatures?.length) {
      return {
        features: clickedFeatures,
        action: () =>
          setClickedFeatures({
            key: source?.source_id,
            clickedFeatures: [],
          }),
      };
    }

    if (hoveredFeatures?.length) {
      return {
        features: hoveredFeatures,
        action: () =>
          setHoveredFeatures({
            key: source?.source_id,
            hoveredFeatures: [],
          }),
      };
    }
  };

  if (!clickedFeatures?.length && !hoveredFeatures?.length) return null;

  const { features, action } = getDetailContent();
  const center =
    features[0].geometry.type === 'Polygon'
      ? centerOfMass({ type: 'Feature', ...features?.[0] })
      : features[0];

  return (
    <Popup
      longitude={center.geometry.coordinates[0]}
      latitude={center.geometry.coordinates[1]}
      offsetTop={features[0].geometry.type === 'Polygon' ? 0 : -25}
      onClose={() => dispatch(action())}
      {...popupProps}
    >
      <FeatureDetail
        titleProperty={titleProperty}
        features={features.map(feature => feature.properties)}
        propertiesToOmit={omitlist}
        propertiesToPick={picklist}
        labelMapping={labelMapping}
      />
    </Popup>
  );
};

export default FeatureDetailPopup;
