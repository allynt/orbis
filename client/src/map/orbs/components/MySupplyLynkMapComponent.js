import { FeatureDetail, Popup } from 'components';
import { pickBy } from 'lodash';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clickedFeaturesSelector,
  hoveredFeaturesSelector,
  setClickedFeatures,
} from '../orbReducer';
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
   *   import('typings/orbis').GeoJsonFeature | undefined,
   *   React.Dispatch<import('typings/orbis').GeoJsonFeature | undefined>
   * ]}
   */
  const [dialogFeature, setDialogFeature] = React.useState();

  React.useEffect(() => {
    if (clickedFeatures?.length === 1) setDialogFeature(clickedFeatures[0]);
  }, [clickedFeatures]);

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
          closeOnClick={false}
          offsetTop={-26}
          captureClick
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
          closeOnClick={false}
          onClose={() =>
            dispatch(
              setClickedFeatures({
                source_id: source?.source_id,
                clickedFeatures: undefined,
              }),
            )
          }
          offsetTop={-26}
          captureClick
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
