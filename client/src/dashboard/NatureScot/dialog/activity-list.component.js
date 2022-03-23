import React from 'react';

import {
  makeStyles,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  List: {
    overflow: 'scroll',
    bgcolor: '#f00',
  },
  highlightedActivity: {
    fontWeight: 'bold',
  },
  normalActivity: {
    fontWeight: 'normal',
  },
  Box: {
    height: '300px',
    overflow: 'auto',
  },
}));

const ActivityList = ({ activityList, name, onSelect, onDelete }) => {
  const styles = useStyles();

  // notify parent via callback

  const onItemSelection = item => {
    if (onSelect) {
      onSelect(item);
    }
  };

  const onItemDelete = activity => {
    if (onDelete) {
      onDelete(activity);
    }
  };

  return (
    <Box sx={{ height: '20rem', overflow: 'auto' }}>
      <List dense component="ul" role="list">
        {activityList.map(activity => {
          const labelId = `${name}-${activity}-label`;
          return (
            <ListItem
              key={activity.label}
              role="listitem"
              button
              onClick={() => onItemSelection(activity)}
            >
              <ListItemText
                id={labelId}
                primary={activity.label}
                primaryTypographyProps={{
                  style: {
                    fontWeight: activity.proposed ? 'bold' : 'normal',
                  },
                }}
              />
              {activity.userdefined ? (
                <Button
                  onClick={() => onItemDelete(activity)}
                  component="a"
                  disableRipple
                >
                  <ListItemText
                    primary="Delete"
                    primaryTypographyProps={{ style: { color: '#f00' } }}
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
