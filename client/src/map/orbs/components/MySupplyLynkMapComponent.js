import React, { useRef } from 'react';
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
import MySupplyLynkFeatureDetail from './mysupplylynk-feature-detail/mysupplylynk-feature-detail.component';

const MySupplyLynkMapComponent = ({ name }) => {
  const dispatch = useDispatch();
  const popupFeatures = useSelector(state => popupFeaturesSelector(state.orbs));
  const dialogFeatures = useSelector(state =>
    dialogFeaturesSelector(state.orbs),
  );
  const ref = useRef(null);
  const dialogVisible = useSelector(state => dialogVisibleSelector(state.orbs));

  return (
    <>
      {popupFeatures?.length && (
        <Popup
          key="popup"
          longitude={popupFeatures[0]?.geometry.coordinates[0]}
          latitude={popupFeatures[0]?.geometry.coordinates[1]}
          closeButton={popupFeatures.length > 1}
          onClose={() => dispatch(setPopupFeatures([]))}
          closeOnClick={false}
          offsetTop={-37}
          captureClick
          captureScroll
        >
          <MySupplyLynkFeatureDetail
            data={popupFeatures.map(feature => feature.properties)}
            onSupplierClick={supplier => {
              dispatch(setDialogFeatures([supplier]));
              dispatch(toggleDialog());
            }}
            name={name}
          />
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
