import React, { useRef } from 'react';
import { pickBy } from 'lodash';
import { Popup } from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';
import {
  dialogFeaturesSelector,
  popupFeaturesSelector,
  setDialogFeatures,
  setPopupFeatures,
  toggleDialog,
  dialogVisibleSelector,
} from '../slices/mysupplylynk.slice';
import { Dialog } from './mysupplylynk-dialog/dialog.component';

import { LAYERS } from '../slices/mysupplylynk.constants';

import FeatureDetail from 'components/feature-detail/feature-detail.component';

import MySupplyLynkFeatureDetail from './mysupplylynk-feature-detail/mysupplylynk-feature-detail.component';

const MySupplyLynkMapComponent = ({ name }) => {
  const dispatch = useDispatch();
  const popupFeatures = useSelector(state => popupFeaturesSelector(state.orbs));
  const dialogFeatures = useSelector(state =>
    dialogFeaturesSelector(state.orbs),
  );
  const ref = useRef(null);
  const dialogVisible = useSelector(state => dialogVisibleSelector(state.orbs));

  const nonRegisteredFooter = {
    label: 'Register now at',
    content: 'www.MySupplyLynk.net',
  };

  return (
    <>
      {popupFeatures?.features?.length && (
        <Popup
          key="popup"
          longitude={popupFeatures?.features[0]?.geometry.coordinates[0]}
          latitude={popupFeatures?.features[0]?.geometry.coordinates[1]}
          closeButton={popupFeatures?.features.length > 1}
          onClose={() => dispatch(setPopupFeatures([]))}
          closeOnClick={false}
          offsetTop={-37}
          captureClick
          captureScroll
        >
          {popupFeatures.id === LAYERS.suppliers && (
            <MySupplyLynkFeatureDetail
              data={popupFeatures.features.map(feature => feature.properties)}
              onSupplierClick={supplier => {
                dispatch(setDialogFeatures([supplier]));
                dispatch(toggleDialog());
              }}
            />
          )}
          {popupFeatures.id === LAYERS.nonRegistered && (
            <FeatureDetail
              title={name}
              features={[
                pickBy(popupFeatures?.features[0]?.properties, (_, key) => {
                  return [
                    'Company',
                    'Postcode',
                    'Email Address',
                    'Telephone',
                    'Website',
                    'Category',
                  ].includes(key);
                }),
              ]}
              footer={nonRegisteredFooter}
            />
          )}
        </Popup>
      )}
      {dialogFeatures?.length && (
        <Dialog
          key="dialog"
          supplier={dialogFeatures[0]}
          onCloseClick={() => dispatch(toggleDialog())}
          isVisible={dialogVisible}
          ref={ref}
        />
      )}
    </>
  );
};

export default MySupplyLynkMapComponent;
