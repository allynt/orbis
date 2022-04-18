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
  ArrowBack,
  ArrowForward,
  ArrowBackIos,
  ArrowForwardIos,
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
  nudge: {
    marginLeft: '0.75rem',
  },
  nudge2: {
    marginLeft: '1rem',
    marginBottom: '0.5rem',
  },
  circle: {
    borderRadius: '50%',
    backgroundColor: theme.palette.text.primary,
    width: '2rem',
    height: '2rem',
    color: theme.palette.secondary.main,
    margin: '0rem 0.5rem',
    padding: '0.1rem',
    cursor: 'pointer',
  },
  capsuleTop: {
    width: '3rem',
    backgroundColor: theme.palette.background.paper,
    borderTopLeftRadius: '50px',
    borderTopRightRadius: '50px',
    position: 'relative',
    top: '0px',
  },
  capsuleBottom: {
    width: '3rem',
    backgroundColor: theme.palette.background.paper,
    borderBottomLeftRadius: '50px',
    borderBottomRightRadius: '50px',
    position: 'relative',
    bottom: '4px',
  },
  capsuleBox: {
    height: '2.6rem',
    backgroundColor: theme.palette.background.paper,
    zIndex: 9999,
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
  filterField: {
    paddingBottom: '1rem',
    marginLeft: '0.75rem',
  },
  blueCircle: {
    borderRadius: '50%',
    backgroundColor: theme.palette.info.main,
    width: '2rem',
    height: '2rem',
    color: theme.palette.secondary.main,
    margin: '0rem 0.5rem',
    padding: '0.1rem',
    cursor: 'pointer',
  },
}));

const AssessmentsShuttle = ({ setValue, data }) => {
  const styles = useStyles();

  const [left, setLeft] = useState(data);
  const [right, setRight] = useState([]);
  const [leftSelected, setLeftSelected] = useState([]);
  const [rightSelected, setRightSelected] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [newActivityText, setNewActivityText] = useState('');
  const [chooseAllDisabledButton, setChooseAllDisabledButton] = useState(false);
  const [removeAllDisabledButton, setRemoveAllDisabledButton] = useState(true);

  useEffect(() => setValue('activities', right), [right, setValue]);

  useEffect(() => setLeft(data), [data]);

  useEffect(() => {
    setChooseAllDisabledButton(left.length === 0);
    setRemoveAllDisabledButton(right.length === 0);
  }, [left, setChooseAllDisabledButton, right, setRemoveAllDisabledButton]);

  const getFilteredLeft = () => {
    let filterList = [];

    // regex filter
    if (searchString) {
      filterList.push(item => {
        const finder = new RegExp(`.*${searchString}.*`, 'i');
        return item.title.match(finder);
      });
    }
    // get filtered list by applying filter functions
    return left.filter(item =>
      filterList.map(filterFunc => filterFunc(item)).every(x => x),
    );
  };

  const handleSearch = searchText => setSearchString(searchText);

  const selectItemOnLeft = object => {
    if (!leftSelected.find(item => item.title === object.title)) {
      setLeftSelected([
        ...leftSelected,
        left.find(item => item.title === object.title),
      ]);
    } else {
      // already selected, remove from selection
      setLeftSelected([
        ...leftSelected.filter(item => item.title !== object.title),
      ]);
    }
  };

  const selectItemOnRight = object => {
    if (!rightSelected.find(item => item.title === object.title)) {
      setRightSelected([
        ...rightSelected,
        right.find(item => item.title === object.title),
      ]);
    } else {
      // already selected, remove from selection
      setRightSelected([
        ...rightSelected.filter(item => item.title !== object.title),
      ]);
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
    const filteredLeft = getFilteredLeft();
    setLeftSelected([]);
    setRight([...right, ...filteredLeft]);
    setRightSelected([]);
    setLeft(left.filter(item => !filteredLeft.includes(item)));
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
    setRight([...right, ...leftSelected.map(item => item)]);
    setLeft(left.filter(item => !leftSelected.includes(item)));
    clearSelections();
  };

  const removeSelected = () => {
    // move selected from right list to left list,
    setLeft([...left, ...rightSelected.filter(item => item && !!item.code)]);
    setRight(right.filter(item => !rightSelected.includes(item) || !item.code));
    setRightSelected([]);
    clearSelections();
  };

  const addActivity = () => {
    if (!newActivityText) return;
    const newActivity = {
      title: newActivityText,
      code: null,
    };
    setRight([...right, newActivity]);
    setNewActivityText('');
  };

  const deleteActivity = activity =>
    setRight(
      right.filter(eachActivity => eachActivity.title !== activity.title),
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
        <Grid item xs={5}>
          <Card>
            <Grid item xs={12}>
              <Typography className={styles.listTitle} variant="h2">
                Available Activities
              </Typography>
            </Grid>
            <Divider />
            <Grid item xs={12}></Grid>
            <Divider />
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              wrap="nowrap"
              className={styles.nudge}
            >
              <MagnifierIcon fontSize="small" color="primary" />
              <TextField
                id="filter-activities"
                margin="normal"
                title="Type ahead..."
                InputProps={{
                  disableUnderline: true,
                  classes: { input: styles.placeholder },
                }}
                className={styles.filterField}
                value={searchString}
                onChange={e => handleSearch(e.target.value)}
              />
            </Grid>
            <Divider />
            <ActivityList
              // name="proposed_activities"
              activityList={getFilteredLeft()}
              selectedActivityList={leftSelected}
              onSelect={selectItemOnLeft}
            />
          </Card>
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
          <div>
            <Grid item xs={12} className={styles.capsuleTop}>
              &nbsp;
            </Grid>
            <Grid item xs={12} className={styles.capsuleBox}>
              <ArrowForward
                className={`${styles.circle} ${
                  leftSelected.length > 0 ? styles.blueCircle : ''
                }`}
                onClick={() => chooseSelected()}
                fontSize="large"
                data-testid="choose activity"
              />
            </Grid>
            <Grid item xs={12} className={styles.capsuleBox}>
              <ArrowBack
                className={`${styles.circle} ${
                  rightSelected.length > 0 ? styles.blueCircle : ''
                }`}
                onClick={() => removeSelected()}
                fontSize="small"
                data-testid="choose selected"
              />
            </Grid>
            <Grid item xs={12} className={styles.capsuleBottom}>
              &nbsp;
            </Grid>
          </div>
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
              className={styles.nudge2}
            >
              <AddCircle
                onClick={addActivity}
                fontSize="small"
                className={`${styles.plusIcon} ${
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
              // name="selected_activities"
              activityList={right}
              selectedActivityList={rightSelected}
              onSelect={selectItemOnRight}
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
            disabled={chooseAllDisabledButton}
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
            disabled={removeAllDisabledButton}
          >
            Remove all
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default AssessmentsShuttle;
