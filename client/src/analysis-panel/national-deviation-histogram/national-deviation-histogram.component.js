import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import {
  Box,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@astrosat/astrosat-ui';

import { aggregationSelector } from 'map/orbs/slices/isolation-plus.slice';

import { BarChart, SidePanelSection } from 'components';

const useStyles = makeStyles(theme => ({
  italic: {
    fontStyle: 'italic',
  },
  select: {
    padding: theme.spacing(1),
  },
}));

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
  const [selectedAggregateArea, setSelectedAggregateArea] = useState('GB');
  const styles = useStyles();

  const aggregationLabel =
    selectedProperty?.aggregation === 'sum' ? 'Sum' : 'Average';

  const areaValue = useSelector(state => aggregationSelector(state?.orbs));

  return (
    <SidePanelSection defaultExpanded title="Selected Data Layer" info={info}>
      <Box display="flex" flexDirection="column">
        <Typography paragraph>{selectedProperty?.label}</Typography>
        {data?.length ? (
          <BarChart
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
            <>
              <Grid item>
                <Typography
                  className={styles.italic}
                  variant="h4"
                  component="p"
                  color="primary"
                >
                  {clickedFeatures?.length > 1 ? aggregationLabel : 'Value'} of
                  selected area{clickedFeatures?.length > 1 ? 's' : ''}:
                </Typography>
              </Grid>

              <Grid item>
                <Typography className={styles.italic} color="primary">
                  {areaValue}
                </Typography>
              </Grid>
            </>
          )}
          {!!selectedProperty?.aggregates && (
            <>
              <Grid item>
                <Typography variant="h4" component="p">
                  {aggregationLabel} of all areas in
                </Typography>
              </Grid>

              <Grid item>
                <Select
                  classes={{
                    select: styles.select,
                  }}
                  fullWidth={false}
                  inputProps={{ 'aria-label': 'Aggregation Area' }}
                  value={selectedAggregateArea}
                  onChange={e => setSelectedAggregateArea(e.target.value)}
                >
                  {Object.keys(selectedProperty.aggregates).map(area => (
                    <MenuItem key={area} value={area}>
                      {area}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item>
                <Typography>:</Typography>
              </Grid>

              <Grid item>
                <Typography>
                  {selectedProperty?.aggregates?.[selectedAggregateArea]}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </SidePanelSection>
  );
};
