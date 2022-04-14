import React from 'react';

import {
  makeStyles,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@astrosat/astrosat-ui';

import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  List: {
    overflow: 'scroll',
    bgcolor: '#f00',
  },
  normalActivity: {
    fontWeight: 'normal',
  },
  selectedActivity: {
    backgroundColor: '#7c8990',
    '&:hover': {
      backgroundColor: '#7c8990',
    },
  },
  unselectedActivity: {},
}));

const ActivityList = ({
  activityList,
  selectedActivityList,
  name,
  onSelect,
  onDelete,
}) => {
  const styles = useStyles();

  // notify parent via callbacks

  const onItemSelection = item => onSelect(item);

  const onItemDelete = activity => onDelete(activity);

  const isSelected = activity =>
    selectedActivityList.find(item => item.title === activity.title);

  return (
    <Box sx={{ height: '20rem', overflow: 'auto' }}>
      <List dense component="ul">
        {activityList.map(activity => {
          const titleId = `${name}-${activity}-title`;
          return (
            <ListItem
              key={activity.title}
              className={
                isSelected(activity)
                  ? styles.selectedActivity
                  : styles.unselectedActivity
              }
              button
              onClick={() => onItemSelection(activity)}
            >
              <ListItemText id={titleId} primary={activity.title} />
              {!activity.code ? (
                <Button
                  onClick={() => onItemDelete(activity)}
                  xs={2}
                  component="a"
                  disableRipple
                >
                  <ListItemText
                    primary="Delete"
                    primaryTypographyProps={{
                      style: {
                        width: '10%',
                        textDecoration: 'underline',
                        color: '#f6be00',
                      },
                    }}
                  />
                </Button>
              ) : null}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default ActivityList;
