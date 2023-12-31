import * as React from 'react';

import { pickBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { FeatureDetail, Popup } from 'components';

import {
  clickedFeaturesSelector,
  hoveredFeaturesSelector,
  setClickedFeatures,
} from '../layers.slice';
import { MySupplyLynkDialog } from './mysupplylynk-dialog/dialog.component';
import MySupplyLynkFeatureDetail from './mysupplylynk-feature-detail/mysupplylynk-feature-detail.component';

const MySupplyLynkMapComponent = ({ source, type }) => {
  const dispatch = useDispatch();
  const hoveredFeatures = useSelector(state =>
    hoveredFeaturesSelector(source.source_id)(state?.orbs),
  );
  const clickedFeatures = useSelector(state =>
    clickedFeaturesSelector(source.source_id)(state?.orbs),
  );

  /**
   * @type {[
   *   import('typings').GeoJsonFeature | undefined,
   *   React.Dispatch<import('typings').GeoJsonFeature | undefined>
   * ]}
   */
  const [dialogFeature, setDialogFeature] = React.useState();

  React.useEffect(() => {
    if (clickedFeatures?.length === 1) {
      setDialogFeature(clickedFeatures[0]);
      if (!dialogFeature)
        dispatch(
          setClickedFeatures({
            key: source.source_id,
            clickedFeatures: undefined,
          }),
        );
    }
  }, [clickedFeatures, dialogFeature, source.source_id, dispatch]);

  const nonRegisteredFooter = {
    label: 'Register now at',
    content: 'www.MySupplyLynk.net',
  };

  const makePopupContent = features => (
    <>
      {type === 'non-registered' && (
        <FeatureDetail
          features={features.map(f =>
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
      {type === 'suppliers' && (
        <MySupplyLynkFeatureDetail
          data={features.map(feature => feature.properties)}
          onSupplierClick={supplier => {
            setDialogFeature({ properties: supplier });
          }}
        />
      )}
    </>
  );

  return (
    <>
      {hoveredFeatures?.length ? (
        <Popup
          key="popup"
          longitude={hoveredFeatures[0].geometry.coordinates[0]}
          latitude={hoveredFeatures[0].geometry.coordinates[1]}
          closeButton={false}
          offsetTop={-26}
          captureScroll
        >
          {makePopupContent(hoveredFeatures)}
        </Popup>
      ) : null}
      {clickedFeatures?.length > 1 ? (
        <Popup
          key="popup"
          longitude={clickedFeatures[0].geometry.coordinates[0]}
          latitude={clickedFeatures[0].geometry.coordinates[1]}
          closeButton
          onClose={() =>
            dispatch(
              setClickedFeatures({
                key: source?.source_id,
                clickedFeatures: undefined,
              }),
            )
          }
          offsetTop={-26}
          captureScroll
        >
          {makePopupContent(clickedFeatures)}
        </Popup>
      ) : null}
      {!!dialogFeature ? (
        <MySupplyLynkDialog
          key="dialog"
          supplier={dialogFeature?.properties}
          onCloseClick={() => setDialogFeature(undefined)}
          isVisible={!!dialogFeature}
        />
      ) : null}
    </>
  );
};

export default MySupplyLynkMapComponent;
