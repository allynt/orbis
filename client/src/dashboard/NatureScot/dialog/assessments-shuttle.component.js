import React, { Fragment, useEffect, useState } from 'react';

import {
  Button,
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
  outlined: {
    padding: '3px',
    borderRadius: '5px',
    backgroundColor: '#323e47',
    border: '1px solid black',
  },
  legend: {
    fontSize: 10,
    fontWeight: 800,
  },
  descriptionText: {
    fontSize: 14,
  },
  placeholder: {
    backgroundColor: theme.palette.background.default,
    borderRadius: '5px',
    width: '30ch',
    height: 25,
    padding: '3px',
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
  nudge2: {
    marginLeft: '1rem',
    marginBottom: '1.25rem',
  },
  inputbox: {
    width: '80%',
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
  const [left, setLeft] = useState(mockData);
  const [right, setRight] = useState([]);
  const [leftSelected, setLeftSelected] = useState([]);
  const [rightSelected, setRightSelected] = useState([]);

  useEffect(() => {
    console.clear();
    console.log('Left:', left);
    console.log('Right Selected: ', right);
    console.log('Left Selected: ', leftSelected);
    console.log('Right Selected: ', rightSelected);
  });

  const selectItemOnLeft = object => {
    if (!leftSelected.find(item => item.label === object.label)) {
      setLeftSelected([
        ...leftSelected,
        left.find(item => item.label === object.label),
      ]);
    }
  };

  const selectItemOnRight = object => {
    if (!rightSelected.find(item => item.label === object.label)) {
      setRightSelected([
        ...rightSelected,
        right.find(item => item.label === object.label),
      ]);
    }
  };

  const chooseAll = () => {
    // user clicks choose all, move all selected to right
    // and remove from left
    // TODO: change to move all VISIBLE to right
    setRight([...right, ...leftSelected.map(item => item)]);
    setLeft(left.filter(item => !leftSelected.includes(item)));
  };

  const removeAll = () => {
    // user clicks remove all, move all selected from right list
    // and back to left list
    // TODO : change to remove all non-user added VISIBLE to left
    // TODO: filter out those with userDefined flag
    console.log('Clicked remove All');
    setLeft([...left, ...rightSelected.map(item => item)]);
    setRight(right.filter(item => !rightSelected.includes(item)));
  };

  return (
    <Fragment>
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
        {/* left list (available activities) */}
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
              justifyContent="space-between"
              wrap="nowrap"
              className={styles.nudge}
            >
              <SearchIcon fontSize="small" />
              <TextField
                id="search"
                name="search"
                margin="normal"
                placeholder="type ahead..."
                variant="filled"
                InputProps={{
                  disableUnderline: true,
                  classes: { input: styles.placeholder },
                }}
                className={[styles.nudge]}
                focused
              />
            </Grid>
            <Divider />
            <ActivityList
              name="proposed_activities"
              activityList={left}
              onSelect={selectItemOnLeft}
            />
          </Card>
        </Grid>
        {/* arrows in middle */}
        <Grid
          container
          alignItems="center"
          justifyContent="space-around"
          wrap="nowrap"
          xs={2}
        >
          <Card>
            <Grid xs={12}>
              <ArrowRightOutlined
                onClick={() => chooseAll()}
                fontSize="large"
              />
            </Grid>
            <Divider />
            <Grid xs={12}>
              <ArrowLeftRounded onClick={() => removeAll()} fontSize="large" />
            </Grid>
          </Card>
        </Grid>
        {/* right list (selected activities) */}
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
              className={styles.nudge2}
            >
              <AddCircle fontSize="small" />
              <TextField
                id="search"
                name="search"
                margin="normal"
                placeholder="Add a new Activity"
                InputProps={{
                  disableUnderline: true,
                  classes: { input: [styles.placeholder] },
                }}
                className={[styles.nudge]}
                focused
              />
            </Grid>
            <Divider />
            <ActivityList
              name="selected_activities"
              activityList={right}
              onSelect={selectItemOnRight}
            />
          </Card>
        </Grid>
        {/* footer left 'choose all' */}
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
          xs={5}
          style={{ marginTop: '1rem' }}
        >
          <Button
            secondary
            endIcon={<ArrowRightOutlined size="medium" />}
            onClick={() => chooseAll()}
            size="small"
          >
            Choose all
          </Button>
        </Grid>
        <Grid xs={2}>
          <Typography variant="h2">&nbsp;</Typography>
        </Grid>
        {/* footer right 'remove all' */}
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
          xs={5}
          style={{ marginTop: '1rem' }}
        >
          <Button
            startIcon={<ArrowLeftOutlined size="medium" />}
            size="small"
            onClick={() => removeAll()}
          >
            Remove all
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default AssessmentsShuttle;
