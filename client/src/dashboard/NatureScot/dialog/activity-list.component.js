import React from 'react';

import {
  makeStyles,
  List,
  ListItem,
  ListItemText,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  List: {
    height: '512px',
  },
}));

/**
 *
 * @param {*} activityList - list of activities
 * @param {string} name - string to identify this list for unique keys
 * @param {function(object):boolean =} filter -  optional filter function to veto each object
 * @returns {JSX}
 */
const ActivityList = ({ activityList, name, filter }) => {
  const styles = useStyles();

  return (
    <List
      sx={{
        width: 200,
        height: 230,
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
          <ListItem key={value.label} role="listitem" button onClick={() => {}}>
            <ListItemText
              id={labelId}
              primary={value.label}
              primaryTypographyProps={{
                fontWeight: value.highlight ? 'bold' : 'normal',
              }}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default ActivityList;
