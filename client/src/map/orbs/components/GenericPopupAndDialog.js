import {
  List,
  ListItem,
  ListItemText,
  ThemeProvider,
  Typography,
} from '@astrosat/astrosat-ui';
import { FeatureDetail, Popup } from 'components';
import { FeatureDialog } from 'components/feature-dialog/feature-dialog.component';
import { omit, pick } from 'lodash';
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  clickedFeaturesSelector,
  hoveredFeaturesSelector,
} from '../orbReducer';

/**
 * @type {import('typings/orbis').MapComponent<{
 *   hoverPopupProps?: {
 *     titleProperty?: string
 *     whitelist?: string[]
 *     footerText?: string
 *   }
 *   dialogProps: import('components/feature-dialog/feature-dialog.component').MetadataFeatureDialogProps
 * }>}
 */
const GenericPopupAndDialog = ({ source, dialogProps, hoverPopupProps }) => {
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
