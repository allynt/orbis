import {
  Button,
  Chip,
  CloseIcon,
  Collapse,
  Typography,
} from '@astrosat/astrosat-ui';
import { SidePanelSection } from 'components';
import { sumBy } from 'lodash';
import { removeClickedFeatures } from 'map/orbs/slices/isolation-plus.slice';
import React, { useState } from 'react';

/**
 * @type {import('typings/orbis').AnalysisPanelComponent<
 *   {},
 *   import('typings/orbis').PolygonPickedMapFeature
 * >}
 * */
export const ClickedFeaturesSummary = ({ clickedFeatures, dispatch }) => {
  const [open, setOpen] = useState(false);

  return (
    <SidePanelSection title="Selected Areas of Interest" defaultExpanded>
      <div style={{ maxWidth: '20rem' }}>
        <Collapse in={open} collapsedHeight="2rem">
          <div>
            {clickedFeatures.map(feature => (
              <Chip
                key={feature.object.properties.index}
                label={feature.object.properties.area_name}
                onDelete={() => dispatch(removeClickedFeatures([feature]))}
                deleteIcon={
                  <CloseIcon
                    style={{ width: '1rem' }}
                    titleAccess={`Remove ${feature.object.properties.area_name}`}
                    role="button"
                  />
                }
              />
            ))}
          </div>
        </Collapse>
        <Button
          size="small"
          onClick={() => dispatch(removeClickedFeatures(clickedFeatures))}
        >
          Deselect All
        </Button>
        <Button size="small" onClick={() => setOpen(o => !o)}>
          {open ? 'Hide' : 'Show'} All
        </Button>
        <Typography>
          Total population(
          {clickedFeatures[0].object.properties.population_year}
          ): {sumBy(clickedFeatures, 'object.properties.population')}
        </Typography>
        <Typography>
          Total households:{' '}
          {sumBy(clickedFeatures, 'object.properties.households')}
        </Typography>
      </div>
    </SidePanelSection>
  );
};
