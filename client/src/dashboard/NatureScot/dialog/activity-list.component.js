import React from 'react';

import {
  makeStyles,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  List: {
    height: '512px',
    overflow: 'scroll',
  },
}));

const ActivityList = ({ activityList, name, onSelect }) => {
  const styles = useStyles();

  const onItemSelection = item => {
    // notify parent via callback
    if (onSelect) {
      onSelect(item);
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
        {activityList.map(value => {
          const labelId = `${name}-${value}-label`;
          return (
            <ListItem
              key={value.label}
              role="listitem"
              button
              onClick={() => onItemSelection(value)}
            >
              <ListItemText
                id={labelId}
                primary={value.label}
                primaryTypographyProps={{
                  style: {
                    fontWeight: value.proposed ? 'bold' : 'normal',
                  },
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default ActivityList;
