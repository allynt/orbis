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

import { TYPE_AHEAD_DEBOUNCE } from '../nature-scotland.constants';
import ActivityList from './activity-list.component';

const useStyles = makeStyles(theme => ({
  listTitle: {
    padding: theme.spacing(2),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  searchField: {
    padding: theme.spacing(1),
  },
  input: {
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    height: '2rem',
    paddingLeft: theme.spacing(2),
  },
  inputIcon: {
    marginRight: theme.spacing(1),
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
  newActivity: {
    color: theme.palette.primary.main,
  },
  footerButton: {
    backgroundColor: 'transparent',
    color: theme.palette.common.white,
  },
}));

/**
 * @param {{
 *  setValue: function
 *  availableActivities: {title: string, code: string}[]
 *  initialActivities: {title: string, code: string|null}[]
 * }} props
 */
const AssessmentsShuttle = ({
  setValue,
  availableActivities,
  initialActivities,
}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const typeAheadActivities = useSelector(impactActivitiesSelector);

  const [typeAheadQuery, setTypeAheadQuery] = useState('');

  const [newActivityText, setNewActivityText] = useState('');

  const [leftSelected, setLeftSelected] = useState([]);

  const [right, setRight] = useState(initialActivities ?? []);
  const [rightSelected, setRightSelected] = useState([]);

  const activitiesToDisplay = !!typeAheadQuery
    ? typeAheadActivities
    : availableActivities;

  const debouncedSearch = useDebounce(
    value =>
      (async () => await dispatch(searchImpactActivities({ query: value })))(),
    TYPE_AHEAD_DEBOUNCE,
  );

  // add activities list to parent form to be tracked, submitted
  useEffect(() => {
    setValue('activities', right, { shouldDirty: true, shouldValidate: true });
  }, [right, setValue]);

  // Type-ahead request to API
  useEffect(() => {
    if (!!typeAheadQuery) {
      debouncedSearch(typeAheadQuery);
    }
  }, [typeAheadQuery, debouncedSearch]);

  const reset = () => {
    setLeftSelected([]);
    setRightSelected([]);
    setNewActivityText('');
  };

  /**
   * @param {{title: string, code: string|null}} selectedActivity
   */
  const selectActivity = selectedActivity => {
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

  const moveSelected = () => {
    const filterAlreadySelected = leftSelected.filter(
      activity => !right.includes(activity),
    );
    setRight(prev => [...prev, ...filterAlreadySelected]);
    reset();
  };

  const moveAll = () => {
    setRight(activitiesToDisplay);
    reset();
  };

  const removeAll = () => setRight([]);

  const addActivity = () => {
    if (!newActivityText) {
      return;
    } else {
      setRight(prev => [...prev, { title: newActivityText, code: null }]);
      setNewActivityText('');
    }
  };

  /**
   * @param {{title: string, code: string|null}} selectedActivity
   */
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
            className={styles.searchField}
          >
            <MagnifierIcon
              fontSize="small"
              color="primary"
              className={styles.inputIcon}
            />
            <TextField
              label="Search for Activities"
              placeholder="Search for Activities"
              value={typeAheadQuery}
              onChange={({ target: { value } }) => setTypeAheadQuery(value)}
              InputProps={{
                disableUnderline: true,
                classes: { input: styles.input },
              }}
            />
          </Grid>
          <Divider />
          <ActivityList
            activityList={activitiesToDisplay}
            selectedActivityList={leftSelected}
            onSelect={selectActivity}
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
            onClick={moveSelected}
            fontSize="large"
            data-testid="choose-activity"
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
            className={styles.searchField}
          >
            <AddCircle
              onClick={addActivity}
              fontSize="small"
              data-testid="add-activity"
              className={clsx(
                styles.inputIcon,
                newActivityText && styles.newActivity,
              )}
            />
            <TextField
              label="Add a new activity"
              placeholder="Add a new activity"
              value={newActivityText}
              onChange={({ target: { value } }) => setNewActivityText(value)}
              InputProps={{
                disableUnderline: true,
                classes: { input: styles.input },
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
            onClick={moveAll}
            className={styles.footerButton}
            size="small"
            variant="text"
            disabled={availableActivities.length === 0}
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
