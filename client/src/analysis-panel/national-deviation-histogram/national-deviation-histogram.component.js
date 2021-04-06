import React from 'react';

import { Box, Grid, Typography } from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import { SidePanelSection } from 'components';
import { aggregationSelector } from 'map/orbs/slices/isolation-plus.slice';
import { Aggregates } from './aggregates.component';
import { AreaValue } from './area-value.component';
import { Histogram } from './histogram.component';

/**
 * @typedef {{
 *  data: {x: number, y: number}[]
 *  info?: string
 * }} NationalDeviationHistogramProps
 */

/**
 * @type {import('typings/orbis').AnalysisPanelComponent<NationalDeviationHistogramProps>}
 */
export const NationalDeviationHistogram = ({
  selectedProperty,
  clickedFeatures,
  data = [],
  info,
}) => {
  const aggregationLabel =
    selectedProperty?.aggregation === 'sum' ? 'Sum' : 'Average';

  const areaValue = useSelector(state => aggregationSelector(state?.orbs));

  return (
    <SidePanelSection defaultExpanded title="Selected Data Layer" info={info}>
      <Box display="flex" flexDirection="column">
        <Typography paragraph>{selectedProperty?.label}</Typography>
        {data?.length ? (
          <Histogram
            color={selectedProperty?.application?.orbis?.display?.color}
            domain={[selectedProperty?.min, selectedProperty?.max]}
            clip={[selectedProperty?.clip_min, selectedProperty?.clip_max]}
            labelX={selectedProperty?.label}
            reversed={
              selectedProperty?.application?.orbis?.display?.colormap_reversed
            }
            labelY="Number of Areas in GB"
            data={data}
            line={areaValue}
          />
        ) : null}
        <Grid container spacing={1} alignItems="center">
          {clickedFeatures?.length && (
            <AreaValue
              value={areaValue}
              aggregated={clickedFeatures.length > 1}
              aggregationLabel={aggregationLabel}
            />
          )}
          {!!selectedProperty?.aggregates && (
            <Aggregates
              aggregates={selectedProperty?.aggregates}
              aggregationLabel={aggregationLabel}
            />
          )}
        </Grid>
      </Box>
    </SidePanelSection>
  );
};
