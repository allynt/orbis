import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { FeatureDetail, Popup } from 'components';

import {
  clickedFeaturesSelector,
  setClickedFeatures,
  setHoveredFeatures,
  hoveredFeaturesSelector,
} from '../orbReducer';

/**
 * @param {{
 * source: import('typings/orbis').Source
 * }} props
 */
const FeatureDetailPopup = ({ source }) => {
  const dispatch = useDispatch();

  /** @type {import('typings/orbis').GeoJsonFeature[]} */
  const clickedFeatures = useSelector(state =>
    clickedFeaturesSelector(source?.source_id)(state?.orbs),
  );

  /** @type {import('typings/orbis').GeoJsonFeature[]} */
  const hoveredFeatures = useSelector(state =>
    hoveredFeaturesSelector(source?.source_id)(state?.orbs),
  );

  if (!clickedFeatures?.length && !hoveredFeatures?.length) {
    return null;
  } else if (clickedFeatures?.length) {
    return (
      <Popup
        latitude={clickedFeatures?.[0]?.geometry.coordinates[1]}
        longitude={clickedFeatures?.[0]?.geometry.coordinates[0]}
        onClose={() =>
          dispatch(
            setClickedFeatures({
              source_id: source?.source_id,
              clickedFeatures: [],
            }),
          )
        }
      >
        <FeatureDetail
          features={clickedFeatures?.map(obj => obj?.properties)}
        />
      </Popup>
    );
  } else if (hoveredFeatures?.length) {
    return (
      <Popup
        latitude={hoveredFeatures?.[0]?.geometry.coordinates[1]}
        longitude={hoveredFeatures?.[0]?.geometry.coordinates[0]}
        onClose={() =>
          dispatch(
            setHoveredFeatures({
              source_id: source?.source_id,
              hoveredFeatures: [],
            }),
          )
        }
      >
        <FeatureDetail
          features={hoveredFeatures?.map(obj => obj?.properties)}
        />
      </Popup>
    );
  }

  return (
    <Popup
      latitude={clickedFeatures?.[0]?.geometry.coordinates[1]}
      longitude={clickedFeatures?.[0]?.geometry.coordinates[0]}
      onClose={() =>
        dispatch(
          setClickedFeatures({
            source_id: source?.source_id,
            clickedFeatures: [],
          }),
        )
      }
    >
      <FeatureDetail features={clickedFeatures?.map(obj => obj?.properties)} />
    </Popup>
  );
};

export default FeatureDetailPopup;
