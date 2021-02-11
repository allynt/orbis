import * as React from 'react';
import { pickBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  dialogFeaturesSelector,
  popupFeaturesSelector,
  setDialogFeatures,
  setPopupFeatures,
  toggleDialog,
  dialogVisibleSelector,
} from '../slices/mysupplylynk.slice';
import { MySupplyLynkDialog } from './mysupplylynk-dialog/dialog.component';

import { LAYERS } from '../slices/mysupplylynk.constants';

import { FeatureDetail, Popup } from 'components';

import MySupplyLynkFeatureDetail from './mysupplylynk-feature-detail/mysupplylynk-feature-detail.component';

const MySupplyLynkMapComponent = ({ name }) => {
  const dispatch = useDispatch();
  const popupFeatures = useSelector(state => popupFeaturesSelector(state.orbs));
  const dialogFeatures = useSelector(state =>
    dialogFeaturesSelector(state.orbs),
  );
  const dialogVisible = useSelector(state => dialogVisibleSelector(state.orbs));

  const nonRegisteredFooter = {
    label: 'Register now at',
    content: 'www.MySupplyLynk.net',
  };

  return (
    <>
      {popupFeatures?.features?.length ? (
        <Popup
          key="popup"
          longitude={popupFeatures?.features[0]?.geometry.coordinates[0]}
          latitude={popupFeatures?.features[0]?.geometry.coordinates[1]}
          closeButton={popupFeatures?.features.length > 1}
          onClose={() => dispatch(setPopupFeatures([]))}
          closeOnClick={false}
          offsetTop={-26}
          captureClick
          captureScroll
        >
          {popupFeatures.id.includes(LAYERS.nonRegistered) && (
            <FeatureDetail
              title={name}
              features={popupFeatures?.features?.map(f =>
                pickBy(f?.properties, (_, key) => {
                  return [
                    'Company',
                    'Postcode',
                    'Email Address',
                    'Telephone',
                    'Website',
                    'Category',
                  ].includes(key);
                }),
              )}
              footer={nonRegisteredFooter}
            />
          )}
          {popupFeatures.id.includes(LAYERS.suppliers) && (
            <MySupplyLynkFeatureDetail
              data={popupFeatures.features.map(feature => feature.properties)}
              onSupplierClick={supplier => {
                dispatch(setDialogFeatures([supplier]));
                dispatch(toggleDialog());
              }}
            />
          )}
        </Popup>
      ) : null}
      {dialogFeatures?.length ? (
        <MySupplyLynkDialog
          key="dialog"
          supplier={dialogFeatures[0]}
          onCloseClick={() => dispatch(toggleDialog())}
          isVisible={dialogVisible}
        />
      ) : null}
    </>
  );
};

export default MySupplyLynkMapComponent;
