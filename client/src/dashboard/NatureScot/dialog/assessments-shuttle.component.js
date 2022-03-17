import React, { Component } from 'react';

import {
  Button,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  makeStyles,
  SearchIcon,
  TextField,
  Typography,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  actionButton: {
    padding: 'unset',
  },
  buttons: {
    '& > *': {
      margin: '1rem',
    },
  },
  fieldset: {
    border: '4px solid',
    borderColor: theme.palette.background.paper,
  },
  legend: {
    fontSize: 10,
    fontWeight: 800,
  },
  descriptionText: {
    fontSize: 14,
  },
  placeholder: {
    backgroundColor: theme.palette.background.paper,
    height: 25,
  },
}));

const AssessmentsShuttle = ({ data, selectedActivity }) => {
  const styles = useStyles();
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Select activities</legend>
      <div>
        <p>
          It looks like you're interested in {selectedActivity}. The list below
          on the left shows some suggested activities that you might undertake
          as part of your development. Please select your activities from the
          'available activities' list and click on the arrow to add them to your
          list. Likewise, you can add or remove items from the "selected
          activities" list.
        </p>
      </div>
      <Grid container>
        <Grid xs={4}>
          <Card>
            <Grid xs={12}>
              <Typography variant="h3">Available Activities</Typography>
            </Grid>
            <Divider />
            <Grid xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Proposed Activities"
                />
              </FormGroup>
            </Grid>
            <Divider />
            <Grid
              container
              alignItems="center"
              justifyContent="space-around"
              wrap="nowrap"
            >
              <SearchIcon />
              <TextField
                id="search"
                name="search"
                margin="normal"
                placeholder="type ahead..."
                InputProps={{
                  disableUnderline: true,
                  classes: { input: styles.placeholder },
                }}
                focused
              />
            </Grid>
          </Card>
        </Grid>
        <Grid xs={4}>
          <h1>Arrows</h1>
        </Grid>
        <Grid xs={4}>
          <h1>Right List</h1>
        </Grid>
      </Grid>
    </fieldset>
  );
};

export default AssessmentsShuttle;
