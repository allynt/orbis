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
    height: '512px',
    overflow: 'scroll',
  },
}));

const ActivityList = ({ activityList, name, onSelect, onDelete }) => {
  const styles = useStyles();
  console.log('onDelete function=>', onDelete);

  // notify parent via callback

  const onItemSelection = item => {
    if (onSelect) {
      onSelect(item);
    }
  };

  const onItemDelete = activity => {
    console.log('onItemDelete', activity);
    if (onDelete) {
      onDelete(activity);
    }
  };

  return (
    <Box sx={{ height: '300px', overflow: 'auto' }}>
      <List
        sx={{
          width: '300px',
          //height: '512px', // TODO: find out how to stretch vertically if empty
          bgcolor: '#f00',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
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
                  //href="#simple-list"
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
