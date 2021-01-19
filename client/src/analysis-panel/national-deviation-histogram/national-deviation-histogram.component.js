import React, { useState } from 'react';

import {
  Box,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@astrosat/astrosat-ui';

import { BarChart, SidePanelSection } from 'components';
import { aggregateValues } from 'analysis-panel/aggregateValues';

const useStyles = makeStyles(theme => ({
  italic: {
    fontStyle: 'italic',
  },
  data: {
    marginTop: theme.spacing(1),
  },
}));

/**
 * @typedef {{
 *  data: {x: number, y: number}[]
 * }} NationalDeviationHistogramProps
 */

/**
 *
 * @type {import('typings/orbis').AnalysisPanelComponent<NationalDeviationHistogramProps>}
 */
export const NationalDeviationHistogram = ({
  selectedProperty,
  clickedFeatures,
  data = [],
}) => {
  const [selectedAggregateArea, setSelectedAggregateArea] = useState('GB');
  const styles = useStyles();
  const areaValue =
    clickedFeatures && aggregateValues(clickedFeatures, selectedProperty);
  const aggregationLabel =
    selectedProperty?.aggregation === 'sum' ? 'Sum' : 'Average';
  return (
    <SidePanelSection defaultExpanded title="Selected Data Layer">
      <Box display="flex" flexDirection="column">
        <Typography paragraph>{selectedProperty?.label}</Typography>
        <BarChart
          color={selectedProperty?.application?.orbis?.display?.color}
          domain={[selectedProperty?.min, selectedProperty?.max]}
          clip={[selectedProperty?.clip_min, selectedProperty?.clip_max]}
          labelX={selectedProperty?.label}
          labelY="Number of Areas"
          data={data}
          line={areaValue}
        />
        <Grid className={styles.data} container spacing={1}>
          {!!selectedProperty?.aggregates && (
            <Grid item xs={12}>
              <Select
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
          )}
          {clickedFeatures?.length && (
            <>
              <Grid item xs={9}>
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
              <Grid item xs={9}>
                <Typography variant="h4" component="p">
                  {aggregationLabel} of all areas in {selectedAggregateArea}:
                </Typography>
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
