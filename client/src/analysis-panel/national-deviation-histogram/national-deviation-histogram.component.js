import React from 'react';

import { Box, Grid, Typography } from '@astrosat/astrosat-ui';

import { get } from 'lodash';
import { useSelector } from 'react-redux';

import { useAnalysisPanelContext } from 'analysis-panel/analysis-panel-context';
import { SidePanelSection } from 'components';
import { otherSelector } from 'map/orbs/layers.slice';

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
 * @type {import('typings').AnalysisPanelComponent<NationalDeviationHistogramProps>}
 */
export const NationalDeviationHistogram = ({
  selectedProperty,
  clickedFeatures,
  data = [],
  info,
}) => {
  const aggregationLabel =
    selectedProperty?.aggregation === 'sum' ? 'Sum' : 'Average';

  const { areaValue, meanAreaValue } = useAnalysisPanelContext();
  const selectedPropertyOtherState = useSelector(state =>
    otherSelector(`${selectedProperty.source_id}/${selectedProperty.name}`)(
      state?.orbs,
    ),
  );
  const clipRange = get(selectedPropertyOtherState, 'clipRange');

  return (
    <SidePanelSection defaultExpanded title="Selected Data Layer" info={info}>
      <Box display="flex" flexDirection="column">
        <Typography paragraph>{selectedProperty?.label}</Typography>
        {data?.length ? (
          <Histogram
            color={selectedProperty?.application?.orbis?.display?.color}
            domain={[selectedProperty?.min, selectedProperty?.max]}
            clip={
              clipRange ?? [
                selectedProperty?.clip_min,
                selectedProperty?.clip_max,
              ]
            }
            labelX={selectedProperty?.label}
            reversed={
              selectedProperty?.application?.orbis?.display?.colormap_reversed
            }
            labelY="Number of Areas in GB"
            data={data}
            line={meanAreaValue}
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
