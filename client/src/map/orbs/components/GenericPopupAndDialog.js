import React, { useState, useEffect, useMemo } from 'react';

import {
  List,
  ListItem,
  ListItemText,
  ThemeProvider,
} from '@astrosat/astrosat-ui';

import { get, omit, pick } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import {
  FeatureDetail,
  Popup,
  FeatureDialog,
  MultipleFeaturesList,
} from 'components';

import {
  clickedFeaturesSelector,
  hoveredFeaturesSelector,
  setClickedFeatures,
} from '../layers.slice';

/**
 * @type {import('typings/orbis').MapComponent<{
 *   hoverPopupProps?: {
 *     titleProperty?: string
 *     whitelist?: string[]
 *     blacklist?: string[]
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
    const { titleProperty, whitelist, blacklist } = hoverPopupProps;
    let properties = hoveredFeatures?.[0]?.properties;
    if (hoverPopupProps.titleProperty)
      properties = omit(properties, titleProperty);
    if (blacklist) properties = omit(properties, blacklist);
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
            title={get(
              hoveredFeatures[0].properties,
              hoverPopupProps.titleProperty,
            )}
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
          offsetTop={-26}
          onClose={() =>
            dispatch(
              setClickedFeatures({
                key: source.source_id,
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
