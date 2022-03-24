import React, { useState } from 'react';

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

import {
  AddCircle,
  ArrowBack,
  ArrowForward,
  ArrowLeftOutlined,
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
    height: '2rem',
    padding: '3px',
  },
  listTitle: {
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
  roundel: {
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
    width: '2rem',
    height: '2rem',
    color: '#333f48',
    margin: '0rem 0.5rem',
    padding: '0.1rem',
  },
  cartoucheTop: {
    width: '3rem',
    backgroundColor: '#5d666e',
    borderTopLeftRadius: '50px',
    borderTopRightRadius: '50px',
    position: 'relative',
    top: '0px',
  },
  cartoucheBottom: {
    width: '3rem',
    backgroundColor: '#5d666e',
    borderBottomLeftRadius: '50px',
    borderBottomRightRadius: '50px',
    position: 'relative',
    bottom: '9px',
  },
  cartoucheLine: {
    border: '2px solid yellow',
    backgroundColor: '#f00',
  },
  cartoucheBox: {
    height: '2.6rem',
    backgroundColor: '#5d666e',
    zIndex: 9999,
  },
  chooseAllButton: {
    marginTop: '1em',
    backgroundColor: '#333f48',
    color: '#fff',
  },
  removeAllButton: {
    marginTop: '1em',
    backgroundColor: '#333f48',
    color: '#fff',
  },
}));

const AssessmentsShuttle = ({ data, selectedActivity }) => {
  const styles = useStyles();

  const [left, setLeft] = useState(data);
  const [right, setRight] = useState([]);
  const [leftSelected, setLeftSelected] = useState([]);
  const [rightSelected, setRightSelected] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [newActivityText, setNewActivityText] = useState('');
  const [onlyProposals, setOnlyProposals] = useState(false);

  const getFilteredLeft = () => {
    let filterList = [];

    // regex filter
    if (searchString) {
      filterList.push(item => {
        const finder = new RegExp(`.*${searchString}.*`, 'i');
        return item.label.match(finder);
      });
    }
    // proposals filter
    if (onlyProposals) {
      filterList.push(item => item.proposed);
    }

    // get filtered list by applying filter functions
    return left.filter(item =>
      filterList.map(filterFunc => filterFunc(item)).every(x => x),
    );
  };

  const handleSearch = searchtext => {
    // typing in search box
    setSearchString(searchtext);
  };

  const getCountAvailableProposals = () =>
    getFilteredLeft().filter(item => item.proposed).length;

  const selectItemOnLeft = object => {
    if (!leftSelected.find(item => item.label === object.label)) {
      setLeftSelected([
        ...leftSelected,
        left.find(item => item.label === object.label),
      ]);
    } else {
      // already selected, remove from selection
      setLeftSelected([
        ...leftSelected.filter(item => item.label !== object.label),
      ]);
    }
  };

  const selectItemOnRight = object => {
    if (!rightSelected.find(item => item.label === object.label)) {
      setRightSelected([
        ...rightSelected,
        right.find(item => item.label === object.label),
      ]);
    } else {
      // already selected, remove from selection
      setRightSelected([
        ...rightSelected.filter(item => item.label !== object.label),
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
    const rightToMove = right.filter(item => !item.userdefined);
    setLeft([...left, ...rightToMove]);
    setRightSelected([]);
    setRight(right.filter(item => item.userdefined));
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
    setLeft([
      ...left,
      ...rightSelected.filter(item => item && !item.userdefined),
    ]);
    setRight(
      right.filter(item => !rightSelected.includes(item) || item.userdefined),
    );
    setRightSelected([]);
    clearSelections();
  };

  const addActivity = () => {
    if (
      !newActivityText ||
      newActivityText.length === 0 ||
      newActivityText === ''
    )
      return;
    const newActivity = {
      value: 100, // TODO: need to think about this. Not used for now, label more important
      label: newActivityText,
      proposed: false,
      userdefined: true,
    };
    setRight([...right, newActivity]);
    setNewActivityText('');
  };

  const deleteActivity = activity =>
    setRight(
      right.filter(eachActivity => eachActivity.label !== activity.label),
    );

  return (
    <>
      <p>
        The purpose of this section is to call out the activities that you may
        undertake as part of your change or developmen. Doing this will allow
        the system to provide you with a more targeted impact assessment report.
      </p>
      <p>
        The available activities list on the left, provides a list of activities
        you may undertake as part of your development. Checking the 'Proposed
        Activities' box will allow you to see the activities usually asociated
        with the change or development you have described. Unchecking this box
        will allow you to see all available activities in the list. You can use
        the type-ahead feature to find an activity.
      </p>
      <p>
        Select your activities from the Available Activities list and click on
        the 'forward' arrow to add them to your Selected Activities list.
        Similarly, you can remove an activity from your Selected Activities list
        by clicking the 'backward' arrow. You can also add a new activity, not
        in the list, by typing it into the top of the Selected Activities box.
      </p>
      <Grid container>
        {/* left list (available activities) */}
        <Grid xs={5}>
          <Card>
            <Grid xs={12}>
              <Typography className={styles.listTitle} variant="h2">
                Available Activities
              </Typography>
            </Grid>
            <Divider />
            <Grid xs={12}>
              <FormGroup className={styles.nudge}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={() => setOnlyProposals(!onlyProposals)}
                    />
                  }
                  label={
                    <Typography className={styles.highlightText}>
                      {`Proposed Activities (${getCountAvailableProposals()} available)`}
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
                className={styles.nudge}
                value={searchString}
                onChange={e => handleSearch(e.target.value)}
                focused
              />
            </Grid>
            <Divider />
            <ActivityList
              name="proposed_activities"
              activityList={getFilteredLeft()}
              selectedActivityList={leftSelected}
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
          <div className="{styles.cartoucheLine}">
            <Grid xs={12} className={styles.cartoucheTop}>
              &nbsp;
            </Grid>
            <Grid xs={12} className={styles.cartoucheBox}>
              <ArrowForward
                className={styles.roundel}
                onClick={() => chooseSelected()}
                fontSize="large"
              />
            </Grid>
            <Grid xs={12} className={styles.cartoucheBox}>
              <ArrowBack
                className={styles.roundel}
                onClick={() => removeSelected()}
                fontSize="small"
              />
            </Grid>
            <Grid xs={12} className={styles.cartoucheBottom}>
              &nbsp;
            </Grid>
          </div>
        </Grid>

        {/* right list (selected activities) */}
        <Grid xs={5}>
          <Card>
            <Grid xs={12}>
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
              <AddCircle onClick={addActivity} fontSize="small" />
              <TextField
                id="search"
                name="search"
                margin="normal"
                value={newActivityText}
                placeholder="Add a new Activity"
                InputProps={{
                  disableUnderline: true,
                  classes: { input: styles.placeholder },
                }}
                className={styles.nudge}
                onChange={e => setNewActivityText(e.target.value)}
                focused
              />
            </Grid>
            <Divider />
            <ActivityList
              name="selected_activities"
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
          direction="row"
          alignItems="center"
          justifyContent="center"
          xs={5}
        >
          <Button
            endIcon={<ArrowRightOutlined size="medium" />}
            onClick={() => chooseAll()}
            className={styles.chooseAllButton}
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
        >
          <Button
            startIcon={<ArrowLeftOutlined size="medium" />}
            size="small"
            onClick={() => removeAll()}
            className={styles.removeAllButton}
          >
            Remove all
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default AssessmentsShuttle;
