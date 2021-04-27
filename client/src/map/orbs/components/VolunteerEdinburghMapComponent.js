import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { centerOfMass } from '@turf/turf';

import { FeatureDetail, Popup } from 'components';
import PopupNote from './popup-note/popup-note.component';

import {
  clickedFeaturesSelector,
  setClickedFeatures,
  setHoveredFeatures,
  hoveredFeaturesSelector,
  saveFeatureNote,
} from '../layers.slice';

/**
 * @param {{
 * source: import('typings/orbis').Source
 * }} props
 */
const VolunteerEdinburghMapComponent = ({ source }) => {
  const dispatch = useDispatch();

  /** @type {import('typings/orbis').GeoJsonFeature[]} */
  const clickedFeatures = useSelector(state =>
    clickedFeaturesSelector(source?.source_id)(state?.orbs),
  );

  /** @type {import('typings/orbis').GeoJsonFeature[]} */
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

  console.log('HIT VE MAP COMPONENT');

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
    >
      <FeatureDetail features={features?.map(obj => obj?.properties)}>
        {features?.map(feat => (
          <PopupNote
            note={feat?.note}
            onNoteSave={({ id, data }) =>
              dispatch(saveFeatureNote({ id, data }))
            }
          />
        ))}
      </FeatureDetail>
    </Popup>
  );
};

export default VolunteerEdinburghMapComponent;
