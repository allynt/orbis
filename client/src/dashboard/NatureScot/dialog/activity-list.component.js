import React from 'react';

import {
  makeStyles,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  container: {
    height: '20rem',
    overflow: 'auto',
  },
  List: {
    overflow: 'scroll',
    bgcolor: '#f00',
  },
  deleteButton: {
    padding: '0 1rem',
  },
  normalActivity: {
    fontWeight: 'normal',
  },
  listItem: {
    '&$selected': {
      backgroundColor: '#7c8990',
    },
    '&:hover': {
      backgroundColor: '#7c8990',
    },
  },
  selected: {},
}));

/**
 * @param {{
 *  activityList: {title: string, code: string|null}[],
 *  selectedActivityList: {title: string, code: string|null}[],
 *  onSelect?: (selectedActivity: {title: string, code: string|null}) => void,
 *  onDelete?: (selectedActivity: {title: string, code: string|null}) => void
 * }} props
 */
const ActivityList = ({
  activityList,
  selectedActivityList,
  onSelect,
  onDelete,
}) => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <List dense>
        {activityList?.map(activity => (
          <ListItem
            key={activity.code}
            aria-label={activity.title}
            className={styles.listItem}
            selected={selectedActivityList.includes(activity)}
            onClick={() => onSelect?.(activity)}
          >
            <ListItemText id={activity.code} primary={activity.title} />
            {!!onDelete ? (
              <Button
                onClick={() => onDelete(activity)}
                variant="text"
                className={styles.deleteButton}
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
        ))}
      </List>
    </div>
  );
};

export default ActivityList;
