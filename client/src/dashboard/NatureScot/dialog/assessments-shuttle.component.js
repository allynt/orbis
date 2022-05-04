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
    width: '90%',
    height: '2rem',
    paddingLeft: '1rem',
  },
  listTitle: {
    padding: '1rem',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  highlightText: {
    color: '#f6be00',
  },
  arrowIcon: {
    borderRadius: '50%',
    backgroundColor: theme.palette.text.primary,
    width: '2rem',
    height: '2rem',
    color: theme.palette.secondary.main,
    margin: '0rem 0.5rem',
    padding: '0.1rem',
  },
  arrowIconActive: {
    backgroundColor: theme.palette.info.main,
  },
  chooseAllButton: {
    marginTop: '1em',
    backgroundColor: theme.palette.secondary.main,
    color: '#fff',
  },
  removeAllButton: {
    marginTop: '1em',
    backgroundColor: theme.palette.secondary.main,
    color: '#fff',
  },
  plusIcon: {
    marginRight: '0.75rem',
    cursor: 'pointer',
  },
  newActivity: {
    color: theme.palette.primary.main,
  },
  checkbox: {
    paddingBottom: '10px',
    paddingTop: '10px',
    marginLeft: '1rem',
  },
  inputIcon: {
    margin: '0.5rem',
  },
  filterField: {
    margin: '1rem 0',
  },
}));

const AssessmentsShuttle = ({ setValue, data, initialActivities }) => {
  const styles = useStyles();

  const filtered = data.filter(
    activity =>
      !initialActivities.some(selected => selected.code === activity.code),
  );

  const [searchString, setSearchString] = useState('');
  const [typeAheadResults, setTypeAheadResults] = useState();

  const [left, setLeft] = useState(initialActivities ? filtered : []);
  const [right, setRight] = useState(initialActivities ?? []);

  const [leftSelected, setLeftSelected] = useState([]);
  const [rightSelected, setRightSelected] = useState([]);

  const [newActivityText, setNewActivityText] = useState('');

  // add activities list to parent form to be tracked, submitted
  useEffect(() => {
    setValue('activities', right, { shouldDirty: true, shouldValidate: true });
  }, [right, setValue]);

  useEffect(() => {
    if (!searchString || searchString === '') {
      setTypeAheadResults(null);
    }
    // fire off type ahead from here
  }, [searchString]);

  useEffect(() => setLeft(data), [data]);

  const userActivityNonSelectable = rightSelected.every(item => !item.code);

  /**
   * @param {{title: string, code: string|null}} selectedActivity
   */
  const selectActivityOnLeft = selectedActivity => {
    // not selected, select
    if (!leftSelected.includes(selectedActivity)) {
      setLeftSelected(prev => [...prev, selectedActivity]);
    } else {
      // already selected, remove from selection
      setLeftSelected(
        leftSelected.filter(activity => activity !== selectedActivity),
      );
    }
  };

  const clearSelections = () => {
    // called after any shuttling between lists
    setLeftSelected([]);
    setRightSelected([]);
    setSearchString('');
  };

  const chooseAll = () => {
    // move all items visible in left list to right (filters applied),
    // irrespective of selection
    setLeftSelected([]);
    setRight(prev => [...prev, ...left]);
    setRightSelected([]);
    setLeft(left.filter(item => !left.includes(item)));
    clearSelections();
  };

  const removeAll = () => {
    // move all items visible in right list to right,
    // irrespective of selection
    const rightToMove = right.filter(item => !!item.code);
    setLeft([...left, ...rightToMove]);
    setRightSelected([]);
    setRight(right.filter(item => !item.code));
    clearSelections();
  };

  const chooseSelected = () => {
    // user clicks choose all, move all selected to right
    // and remove from left
    setRight(prev => [...prev, ...leftSelected]);
    clearSelections();
  };

  const removeSelected = () => {
    // move selected from right list to left list,
    setLeft(prev => [...prev, ...rightSelected.filter(item => !!item.code)]);
    setRight(prev =>
      prev.filter(item => !rightSelected.includes(item) || !item.code),
    );
    setRightSelected([]);
    clearSelections();
  };

  const addActivity = () => {
    if (!newActivityText) return;
    const newActivity = {
      title: newActivityText,
      code: null,
    };
    setRight(prev => [...prev, newActivity]);
    setNewActivityText('');
  };

  const deleteActivity = selectedActivity => {
    setRight(prev =>
      prev.filter(activity => activity.title !== selectedActivity.title),
    );
  };

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
              // still need id and title?
              id="filter-activities"
              title="Type ahead..."
              label="Type ahead..."
              InputProps={{
                disableUnderline: true,
                classes: { input: styles.placeholder },
              }}
              className={styles.filterField}
              value={searchString}
              onChange={({ target: { value } }) => setSearchString(value)}
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
          justifyContent="space-around"
          wrap="nowrap"
          xs={2}
        >
          <ArrowForward
            className={clsx(
              styles.arrowIcon,
              leftSelected.length > 0 && styles.arrowIconActive,
            )}
            onClick={() => chooseSelected()}
            fontSize="large"
            data-testid="choose activity"
            cursor="pointer"
          />
        </Grid>

        {/* right list (selected activities) */}
        <Grid item xs={5}>
          <Card>
            <Grid item xs={12}>
              <Typography className={styles.listTitle} variant="h2">
                Selected Activities
              </Typography>
            </Grid>
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
                className={`${styles.inputIcon} ${
                  newActivityText ? styles.newActivity : ''
                }`}
              />
              <TextField
                id="add-activity"
                margin="normal"
                value={newActivityText}
                title="Add a new Activity"
                InputProps={{
                  disableUnderline: true,
                  classes: { input: styles.placeholder },
                }}
                maxLength={50}
                onChange={e => setNewActivityText(e.target.value)}
              />
            </Grid>
            <Divider />
            <ActivityList
              activityList={right}
              selectedActivityList={rightSelected}
              onDelete={deleteActivity}
            />
          </Card>
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
            onClick={() => chooseAll()}
            className={styles.chooseAllButton}
            size="small"
            variant="text"
            disabled={left.length === 0}
          >
            Choose all
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h2">&nbsp;</Typography>
        </Grid>

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
            startIcon={
              <ArrowBackIos className={styles.removeAllIcon} size="small" />
            }
            size="small"
            variant="text"
            onClick={() => removeAll()}
            className={styles.removeAllButton}
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
