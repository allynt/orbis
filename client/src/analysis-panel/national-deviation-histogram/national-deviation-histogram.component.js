import React, { useState } from 'react';

import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import { SidePanelSection } from 'components';
import { aggregationSelector } from 'map/orbs/slices/isolation-plus.slice';
import { Histogram } from './histogram.component';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  italic: {
    fontStyle: 'italic',
  },
  select: {
    padding: theme.spacing(1),
  },
  buttonGroup: {
    margin: '0 auto',
    marginBottom: theme.spacing(2),
  },
  notActive: {
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.dark,
    cursor: 'pointer',
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
  const [scale, setScale] = useState('linear');
  const styles = useStyles();

  const aggregationLabel =
    selectedProperty?.aggregation === 'sum' ? 'Sum' : 'Average';

  const areaValue = useSelector(state => aggregationSelector(state?.orbs));

  return (
    <SidePanelSection defaultExpanded title="Selected Data Layer" info={info}>
      <Box display="flex" flexDirection="column">
        <Typography paragraph>{selectedProperty?.label}</Typography>
        <ButtonGroup className={styles.buttonGroup} size="small">
          <Button
            onClick={() => setScale('linear')}
            className={clsx({ [styles.notActive]: scale !== 'linear' })}
          >
            Lin
          </Button>
          <Button
            onClick={() => setScale('log')}
            className={clsx({ [styles.notActive]: scale !== 'log' })}
          >
            Log
          </Button>
        </ButtonGroup>
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
            dependentScale={scale}
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
