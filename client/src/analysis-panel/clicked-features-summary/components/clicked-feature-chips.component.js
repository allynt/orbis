import React, { useState } from 'react';

import { Collapse, Fade, Grid } from '@astrosat/astrosat-ui';

import { TooltipChip } from './tooltip-chip.component';
import { ControlButtons } from './control-buttons.component';

/**
 * @param {{
 *   clickedFeatures: import('typings/orbis').PolygonPickedMapFeature[]
 *   onFeatureDelete: (feature: import('typings/orbis').PolygonPickedMapFeature) => void
 *   onDeselectAllClick: () => void
 *   fallbackProperty?: string
 * }} props
 * @returns
 */
export const ClickedFeatureChips = ({
  clickedFeatures,
  onFeatureDelete,
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
              <Fade in key={feature.index}>
                <TooltipChip
                  feature={feature}
                  isOnlyFeature={clickedFeatures.length === 1}
                  fallbackProperty={fallbackProperty}
                  onDelete={() => onFeatureDelete(feature)}
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
