import React, { useEffect, useState } from 'react';

import {
  Button,
  Card,
  Divider,
  Grid,
  makeStyles,
  MagnifierIcon,
  TextField,
  Typography,
} from '@astrosat/astrosat-ui';

import {
  AddCircle,
  ArrowForward,
  ArrowBackIos,
  ArrowForwardIos,
} from '@material-ui/icons';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

import {
  searchImpactActivities,
  impactActivitiesSelector,
} from 'dashboard/NatureScot/nature-scot.slice';
import { useDebounce } from 'hooks/useDebounce';

import ActivityList from './activity-list.component';

const useStyles = makeStyles(theme => ({
  placeholder: {
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    width: '90%',
    height: '2rem',
    paddingLeft: theme.spacing(2),
  },
  listTitle: {
    padding: theme.spacing(2),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  arrowIcon: {
    borderRadius: '50%',
    backgroundColor: theme.palette.text.primary,
    width: '2rem',
    height: '2rem',
    color: theme.palette.secondary.main,
    margin: `0 ${theme.spacing(1)}`,
    padding: '0.1rem',
  },
  arrowIconActive: {
    backgroundColor: theme.palette.info.main,
  },
  footerButton: {
    backgroundColor: 'transparent',
    color: theme.palette.common.white,
  },
  newActivity: {
    color: theme.palette.primary.main,
  },
  inputIcon: {
    margin: theme.spacing(1),
  },
  filterField: {
    marginBottom: theme.spacing(2),
  },
}));

const AssessmentsShuttle = ({ setValue, data, initialActivities }) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const typeAheadActivities = useSelector(impactActivitiesSelector);

  const [typeAheadQuery, setTypeAheadQuery] = useState('');
  const [typeAheadResults, setTypeAheadResults] = useState(null);

  const [newActivityText, setNewActivityText] = useState('');

  const [left, setLeft] = useState(data);
  const [leftSelected, setLeftSelected] = useState([]);
  console.log('left: ', left);

  const [right, setRight] = useState(initialActivities ?? []);
  const [rightSelected, setRightSelected] = useState([]);

  const debouncedSearch = useDebounce(
    value =>
      (async () => await dispatch(searchImpactActivities({ query: value })))(),
    500,
  );

  // add activities list to parent form to be tracked, submitted
  useEffect(() => {
    setValue('activities', right, { shouldDirty: true, shouldValidate: true });
  }, [right, setValue]);

  useEffect(() => {
    setTypeAheadResults(typeAheadActivities);
  }, [typeAheadActivities]);

  // Type-ahead request to API
  useEffect(() => {
    if (!!typeAheadQuery) {
      debouncedSearch(typeAheadQuery);
    }
  }, [typeAheadQuery, debouncedSearch]);

  /**
   * @param {{title: string, code: string|null}} selectedActivity
   */
  const selectActivityOnLeft = selectedActivity => {
    // if not selected, select
    if (!leftSelected.includes(selectedActivity)) {
      setLeftSelected(prev => [...prev, selectedActivity]);
    } else {
      // if already selected, unselect
      setLeftSelected(
        leftSelected.filter(activity => activity !== selectedActivity),
      );
    }
  };

  const clearSelections = () => {
    // called after any shuttling between lists

    // TODO: do we want to be doing all this?

    setLeftSelected([]);
    setRightSelected([]);
    setTypeAheadQuery('');
    setNewActivityText('');
  };

  const chooseAll = () => {
    // Move all from left
    setLeft([]);
    setRight(prev => [...prev, ...left]);
    clearSelections();
  };

  const removeAll = () => {
    // Remove all from right
    setRight([]);
    clearSelections();
  };

  const chooseSelected = () => {
    // Copy all selected to right
    setRight(prev => [...prev, ...leftSelected]);
    clearSelections();
  };

  const addActivity = () => {
    if (!newActivityText) {
      return;
    } else {
      setRight(prev => [...prev, { title: newActivityText, code: null }]);
      setNewActivityText('');
    }
  };

  const deleteActivity = selectedActivity =>
    setRight(prev =>
      prev.filter(activity => activity.title !== selectedActivity.title),
    );

  return (
    <>
      <p>
        The purpose of this section is to call out the activities that you may
        undertake as part of your change or development. Doing this will allow
        the system to provide you with a more targeted impact assessment report.
      </p>
      <p>
        The Available Activities list on the left, provides a list of activities
        that you may undertake as part of your development. Select your
        activities from the Available Activities list and click on the "forward"
        arrow to add them to your Selected Activities list. Similarly, you can
        remove an activity from your Selected Activities list by clicking the
        "backward" arrow. You can also add a new activity, not on the list, by
        typing it into the top of the Selected Activities box.
      </p>
      <Grid container>
        {/* left list (available activities) */}
        <Grid item component={Card} xs={5}>
          <Typography className={styles.listTitle} variant="h2">
            Available Activities
          </Typography>
          <Divider />
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            wrap="nowrap"
          >
            <MagnifierIcon
              fontSize="small"
              color="primary"
              className={styles.inputIcon}
            />
            <TextField
              label="Search for Activities"
              className={styles.filterField}
              value={typeAheadQuery}
              onChange={({ target: { value } }) => setTypeAheadQuery(value)}
              InputProps={{
                disableUnderline: true,
                classes: { input: styles.placeholder },
              }}
            />
          </Grid>
          <Divider />
          <ActivityList
            activityList={typeAheadResults ?? left}
            selectedActivityList={leftSelected}
            onSelect={selectActivityOnLeft}
          />
        </Grid>

        {/* arrows in middle */}
        <Grid
          container
          item
          alignItems="center"
          justifyContent="center"
          wrap="nowrap"
          xs={2}
        >
          <ArrowForward
            className={clsx(
              styles.arrowIcon,
              leftSelected.length > 0 && styles.arrowIconActive,
            )}
            onClick={chooseSelected}
            fontSize="large"
            data-testid="choose activity"
            cursor="pointer"
          />
        </Grid>

        {/* right list (selected activities) */}
        <Grid item xs={5} component={Card}>
          <Typography className={styles.listTitle} variant="h2">
            Selected Activities
          </Typography>
          <Divider />
          <Grid
            container
            alignItems="center"
            justifyContent="space-around"
            wrap="nowrap"
          >
            <AddCircle
              onClick={addActivity}
              fontSize="small"
              className={clsx(
                styles.inputIcon,
                newActivityText && styles.newActivity,
              )}
            />
            <TextField
              label="Add a new activity"
              value={newActivityText}
              onChange={({ target: { value } }) => setNewActivityText(value)}
              InputProps={{
                disableUnderline: true,
                classes: { input: styles.placeholder },
              }}
              maxLength={50}
            />
          </Grid>
          <Divider />
          <ActivityList
            activityList={right}
            selectedActivityList={rightSelected}
            onDelete={deleteActivity}
          />
        </Grid>

        {/* footer left 'choose all' */}
        <Grid
          container
          item
          direction="row"
          alignItems="center"
          justifyContent="center"
          xs={5}
        >
          <Button
            endIcon={<ArrowForwardIos size="small" />}
            onClick={chooseAll}
            className={styles.footerButton}
            size="small"
            variant="text"
            disabled={left.length === 0}
          >
            Choose all
          </Button>
        </Grid>

        {/* For even spacing */}
        <Grid item xs={2} />

        {/* footer right 'remove all' */}
        <Grid
          container
          item
          direction="row"
          alignItems="center"
          justifyContent="center"
          xs={5}
        >
          <Button
            startIcon={<ArrowBackIos size="small" />}
            size="small"
            variant="text"
            onClick={removeAll}
            className={styles.footerButton}
            disabled={right.length === 0}
          >
            Remove all
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default AssessmentsShuttle;
