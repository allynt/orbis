import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Popup } from 'components';

import { clickedFeaturesSelector, setClickedFeatures } from '../orbReducer';

const FeatureDetailPopup = () => {
  const dispatch = useDispatch();

  const clickedFeatures = useSelector(state => clickedFeaturesSelector(state));

  return (
    <Popup onClose={() => dispatch(setClickedFeatures([]))}>
      <div>Hello from FeatureDetailPopup</div>
    </Popup>
  );
};

export default FeatureDetailPopup;
