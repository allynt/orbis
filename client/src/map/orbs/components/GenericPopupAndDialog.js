import {
  List,
  ListItem,
  ListItemText,
  ThemeProvider,
} from '@astrosat/astrosat-ui';
import { FeatureDetail, Popup } from 'components';
import { FeatureDialog } from 'components/feature-dialog/feature-dialog.component';
import { MultipleFeaturesList } from 'components/multiple-features-list/multiple-features-list.component';
import { omit, pick } from 'lodash';
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clickedFeaturesSelector,
  hoveredFeaturesSelector,
  setClickedFeatures,
} from '../orbReducer';

/**
 * @type {import('typings/orbis').MapComponent<{
 *   hoverPopupProps?: {
 *     titleProperty?: string
 *     whitelist?: string[]
 *     footerText?: string
 *   }
 *   groupPopupProps?: import('components/multiple-features-list/multiple-features-list.component').MultipleFeaturesListMetadataProps
 *   dialogProps: import('components/feature-dialog/feature-dialog.component').MetadataFeatureDialogProps
 * }>}
 */
const GenericPopupAndDialog = ({
  source,
  dialogProps,
  hoverPopupProps,
  groupPopupProps,
}) => {
  const dispatch = useDispatch();
  const { source_id } = source;
  const hoveredFeatures = useSelector(state =>
    hoveredFeaturesSelector(source_id)(state?.orbs),
  );
  const clickedFeatures = useSelector(state =>
    clickedFeaturesSelector(source_id)(state?.orbs),
  );
  /** @type {[import('typings/orbis').GeoJsonFeature | undefined, React.Dispatch<import('typings/orbis').GeoJsonFeature | undefined>]} */
  const [dialogFeature, setDialogFeature] = useState();

  useEffect(() => {
    if (clickedFeatures?.length === 1) setDialogFeature(clickedFeatures[0]);
  }, [clickedFeatures]);

  const hoverPopupProperties = useMemo(() => {
    const { titleProperty, whitelist } = hoverPopupProps;
    let properties = hoveredFeatures?.[0]?.properties;
    if (hoverPopupProps.titleProperty)
      properties = omit(properties, titleProperty);
    if (whitelist) properties = pick(properties, whitelist);
    return properties;
  }, [hoverPopupProps, hoveredFeatures]);

  return (
    <>
      {hoveredFeatures?.length ? (
        <Popup
          longitude={hoveredFeatures[0].geometry.coordinates[0]}
          latitude={hoveredFeatures[0].geometry.coordinates[1]}
          closeButton={false}
          offsetTop={-26}
        >
          <FeatureDetail
            title={hoveredFeatures[0].properties[hoverPopupProps.titleProperty]}
            features={[hoverPopupProperties]}
          >
            <List disablePadding>
              <ListItem>
                <ListItemText primary={hoverPopupProps.footerText} />
              </ListItem>
            </List>
          </FeatureDetail>
        </Popup>
      ) : null}
      {clickedFeatures?.length > 1 ? (
        <Popup
          longitude={clickedFeatures[0].geometry.coordinates[0]}
          latitude={clickedFeatures[0].geometry.coordinates[1]}
          closeOnClick={false}
          offsetTop={-26}
          onClose={() =>
            dispatch(
              setClickedFeatures({
                source_id: source.source_id,
                clickedFeatures: undefined,
              }),
            )
          }
        >
          <MultipleFeaturesList
            features={clickedFeatures}
            onMoreDetailsClick={f => setDialogFeature(f)}
            {...groupPopupProps}
          />
        </Popup>
      ) : null}
      <ThemeProvider theme="light">
        <FeatureDialog
          open={!!dialogFeature}
          feature={dialogFeature}
          onClose={() => setDialogFeature(undefined)}
          {...dialogProps}
        />
      </ThemeProvider>
    </>
  );
};

export default GenericPopupAndDialog;
