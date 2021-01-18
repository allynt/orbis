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

const useStyles = makeStyles(theme => ({
  italic: {
    fontStyle: 'italic',
  },
  data: {
    marginTop: theme.spacing(1),
  },
}));

/**
 * @param {{
 *  areaValue: number
 *  selectedProperty: import('typings/orbis').Property
 * }} props
 */
export const NationalDeviationHistogram = ({ areaValue, selectedProperty }) => {
  const [selectedAggregateArea, setSelectedAggregateArea] = useState('GB');
  const styles = useStyles();
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
          data={
            selectedProperty?.application?.orbis?.data_visualisation_components
              ?.props?.data || []
          }
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
          <Grid item xs={9}>
            <Typography
              className={styles.italic}
              variant="h4"
              component="p"
              color="primary"
            >
              Value of selected area:
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={styles.italic} color="primary">
              {areaValue}
            </Typography>
          </Grid>
          {!!selectedProperty?.aggregates && (
            <>
              <Grid item xs={9}>
                <Typography variant="h4" component="p">
                  {selectedProperty?.aggregation === 'sum' ? 'Sum' : 'Average'}{' '}
                  of all areas in {selectedAggregateArea}:
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
