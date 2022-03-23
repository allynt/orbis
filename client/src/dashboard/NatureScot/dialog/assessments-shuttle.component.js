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
  ArrowRightOutlined,
} from '@material-ui/icons';
import { act } from 'react-dom/test-utils';

import { Form } from 'components';

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

const AssessmentsShuttle = ({ data, selectedActivity }) => {
  const styles = useStyles();

  const [left, setLeft] = useState(data);
  const [right, setRight] = useState([]);
  const [leftSelected, setLeftSelected] = useState([]);
  const [rightSelected, setRightSelected] = useState([]);
  const [searchString, setSearchString] = useState([]);
  const [newActivityText, setNewActivityText] = useState('');
  const [onlyProposals, setOnlyProposals] = useState(false);

  useEffect(() => {
    console.clear();
    console.log('Left:', left);
    console.log('Filtered left', getFilteredLeft());
    console.log('Right Selected: ', right);
    console.log('Left Selected: ', leftSelected);
    console.log('Right Selected: ', rightSelected);
    console.log('searchString', searchString);
    console.log('newActivityText', newActivityText);
  });

  const getFilteredLeft = () => {
    let filterList = [];

    // regex filter
    if (searchString) {
      filterList.push(item => {
        const finder = new RegExp(`.*${searchString}.*`, 'i');
        return item.label.match(finder);
      });
    }
    // proposals filter?
    if (onlyProposals) {
      filterList.push(item => item.proposed);
    }

    // get filtered list by applying filter functions
    return left.filter(item => {
      let votes = filterList.map(filterFunc => filterFunc(item));
      return votes.every(item => item);
    });
  };

  const handleSearch = searchtext => {
    // typing in search box
    setSearchString(searchtext);
  };

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

  const clearSelections = () => {
    // called after any shuttling between lists
    setLeftSelected([]);
    setRightSelected([]);
    setSearchString(['']);
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
    // TODO: make sure this excludes userdefined options
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
    const newActivity = {
      value: 100, // TODO: need to think about this. Not used for now, label more important
      label: newActivityText,
      proposed: false,
      userdefined: true,
    };
    setRight([...right, newActivity]);
    setNewActivityText(['']);
  };

  const deleteActivity = activity => {
    setRight(
      right.filter(eachActivity => eachActivity.label !== activity.label),
    );
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
                  control={
                    <Checkbox
                      onChange={() => setOnlyProposals(!onlyProposals)}
                    />
                  }
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
                onClick={() => chooseSelected()}
                fontSize="large"
              />
            </Grid>
            <Divider />
            <Grid xs={12}>
              <ArrowLeftRounded
                onClick={() => removeSelected()}
                fontSize="large"
              />
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
