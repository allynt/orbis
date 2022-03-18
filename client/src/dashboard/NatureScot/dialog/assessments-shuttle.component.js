import React from 'react';

import {
  //Button,
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

import {
  AddCircle,
  ArrowLeftOutlined,
  ArrowLeftRounded,
  ArrowRightAltRounded,
  ArrowRightOutlined,
} from '@material-ui/icons';

import ActivityList from './activity-list.component';

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
  listtitle: {
    padding: '1rem',
    textTransform: 'uppercase',
  },
  highlightText: {
    color: '#f6be00',
  },
  nudge: {
    marginLeft: '1rem',
  },
}));

const mockData = [
  {
    label: 'Plant flowerbed',
    value: 1,
    highlight: true,
  },
  {
    label: 'Build a fence',
    value: 2,
  },
  {
    label: 'Install a shed',
    value: 3,
    highlight: true,
  },
  {
    label: 'Grow some flowers',
    value: 4,
  },
  {
    label: 'Lay a track',
    value: 5,
  },
  {
    label: 'Install telegraph pole',
    value: 6,
  },
];

const AssessmentsShuttle = ({ data, selectedActivity }) => {
  const styles = useStyles();
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Select activities</legend>
      <div>
        <p>
          It looks like you're interested in{' '}
          <span className={styles.highlightText}>{selectedActivity}</span>. The
          list below on the left shows some suggested activities that you might
          undertake as part of your development. Please select your activities
          from the 'available activities' list and click on the arrow to add
          them to your list. Likewise, you can add or remove items from the
          "selected activities" list.
        </p>
      </div>
      <Grid container>
        <Grid xs={5}>
          <Card>
            <Grid xs={12}>
              <Typography className={styles.listtitle} variant="h2">
                Available Activities
              </Typography>
            </Grid>
            <Divider />
            <Grid xs={12}>
              <FormGroup className={styles.nudge}>
                <FormControlLabel
                  control={<Checkbox />}
                  label={
                    <Typography className={styles.highlightText}>
                      Proposed Activities
                    </Typography>
                  }
                />
              </FormGroup>
            </Grid>
            <Divider />
            <Grid
              container
              alignItems="center"
              justifyContent="space-around"
              wrap="nowrap"
              className={styles.nudge}
            >
              <SearchIcon fontSize="small" />
              <TextField
                id="search"
                name="search"
                margin="normal"
                placeholder="type ahead..."
                InputProps={{
                  disableUnderline: true,
                  classes: { input: styles.placeholder },
                }}
                className={styles.nudge}
                focused
              />
            </Grid>
            <Divider />
            <ActivityList name="proposed_activities" activityList={mockData} />
          </Card>
        </Grid>
        <Grid
          container
          alignItems="center"
          justifyContent="space-around"
          wrap="nowrap"
          xs={2}
        >
          <Card>
            <Grid xs={12}>
              <ArrowRightOutlined fontSize="large" />
            </Grid>
            <Divider />
            <Grid xs={12}>
              <ArrowLeftRounded fontSize="large" />
            </Grid>
          </Card>
        </Grid>
        <Grid xs={5}>
          <Card>
            <Grid xs={12}>
              <Typography className={styles.listtitle} variant="h2">
                Selected Activities
              </Typography>
            </Grid>
            <Divider />
            <Grid
              container
              alignItems="center"
              justifyContent="space-around"
              wrap="nowrap"
              className={styles.nudge}
            >
              <AddCircle fontSize="small" />
              <TextField
                id="search"
                name="search"
                margin="normal"
                placeholder="Add a new Activity"
                InputProps={{
                  disableUnderline: true,
                  classes: { input: styles.placeholder },
                }}
                focused
              />
            </Grid>
            <Divider />
            <ActivityList name="selected_activities" activityList={[]} />
          </Card>
        </Grid>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          xs={5}
        >
          <Typography variant="h2">Choose all</Typography>
          <ArrowRightOutlined size="medium" />
        </Grid>
        <Grid xs={2}>
          <Typography variant="h2">&nbsp;</Typography>
        </Grid>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          xs={5}
        >
          <ArrowLeftOutlined size="medium" />
          <Typography variant="h2">Remove all</Typography>
        </Grid>
      </Grid>
    </fieldset>
  );
};

export default AssessmentsShuttle;
