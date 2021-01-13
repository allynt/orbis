import * as React from 'react';

import { Box, Grid, makeStyles, Typography } from '@astrosat/astrosat-ui';

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
          <Grid item xs={8}>
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
          <Grid item xs={8}>
            <Typography variant="h4" component="p">
              {selectedProperty?.aggregation === 'sum' ? 'Sum' : 'Average'} of
              all areas in GB:
            </Typography>
          </Grid>
          <Grid item>
            <Typography> {selectedProperty?.aggregates?.GB}</Typography>
          </Grid>
        </Grid>
      </Box>
    </SidePanelSection>
  );
};
