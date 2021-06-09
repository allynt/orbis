import React, { useState } from 'react';

import { Collapse, Fade, Grid } from '@astrosat/astrosat-ui';

import { ControlButtons } from './control-buttons.component';
import { TooltipChip } from './tooltip-chip.component';

/**
 * @param {{
 *   clickedFeatures: import('typings/orbis').PolygonPickedMapFeature[]
 *   hoveredFeatures: import('typings/orbis').PolygonPickedMapFeature[]
 *   onFeatureDelete: (feature: import('typings/orbis').PolygonPickedMapFeature) => void
 *   onFeatureClick: (feature: import('typings/orbis').PolygonPickedMapFeature) => void
 *   onFeatureHover: (feature?: import('typings/orbis').PolygonPickedMapFeature) => void
 *   onDeselectAllClick: () => void
 *   fallbackProperty?: string
 * }} props
 * @returns
 */
export const ClickedFeatureChips = ({
  clickedFeatures,
  hoveredFeatures,
  onFeatureDelete,
  onFeatureClick,
  onFeatureHover,
  onDeselectAllClick,
  fallbackProperty,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Grid item xs={12}>
        <Collapse in={open} collapsedHeight="1.6rem">
          <Grid container spacing={1}>
            {clickedFeatures?.map(feature => (
              <Fade
                in
                key={
                  feature.object.properties[fallbackProperty] ??
                  feature.object.id
                }
              >
                <TooltipChip
                  feature={feature}
                  isOnlyFeature={clickedFeatures.length === 1}
                  fallbackProperty={fallbackProperty}
                  onMouseEnter={() => onFeatureHover(feature)}
                  onMouseLeave={() => onFeatureHover(undefined)}
                  isHovered={hoveredFeatures?.some(
                    feat =>
                      feat.object.properties[fallbackProperty] ===
                      (feature.object.properties[fallbackProperty] ??
                        feature.object.id),
                  )}
                  onDelete={() => onFeatureDelete(feature)}
                  onClick={() => onFeatureClick(feature)}
                />
              </Fade>
            ))}
          </Grid>
        </Collapse>
      </Grid>
      <Grid item xs container justify="center">
        <ControlButtons
          open={open}
          onDeselectAllClick={onDeselectAllClick}
          onShowHideAllClick={() => setOpen(o => !o)}
        />
      </Grid>
    </>
  );
};
