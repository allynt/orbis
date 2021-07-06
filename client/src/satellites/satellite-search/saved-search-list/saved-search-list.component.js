import React from 'react';

import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  listItem: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    columnGap: theme.spacing(1),
  },
  text: {
    gridColumn: '1/-1',
  },
  bold: {
    fontWeight: 600,
  },
}));

/**
 * @param {{
 *  savedSearches: import('typings/satellites').SavedSearch[]
 *  onReloadClick: (search: import('typings/satellites').SavedSearch) => void
 *  onDeleteClick: (search: import('typings/satellites').SavedSearch) => void
 * }} props
 */
const SavedSearchList = ({ savedSearches, onReloadClick, onDeleteClick }) => {
  const styles = useStyles();

  return (
    <List>
      {savedSearches &&
        savedSearches.map(search => {
          return (
            <ListItem key={search.name} className={styles.listItem}>
              <ListItemText
                className={styles.text}
                primary={search.name}
                secondary={
                  <>
                    <Divider />
                    <Typography>
                      <span className={styles.bold}>Saved Dates:</span>{' '}
                      {search.start_date} to
                      {search.end_date}
                    </Typography>
                    <Typography>
                      <span className={styles.bold}>Resolution:</span>{' '}
                      {search.tiers.join(', ')}
                    </Typography>
                  </>
                }
              />
              <Button size="small" onClick={() => onReloadClick(search)}>
                Reload
              </Button>
              <Button
                size="small"
                color="secondary"
                onClick={() => onDeleteClick(search)}
              >
                Delete
              </Button>
            </ListItem>
          );
        })}
    </List>
  );
};

export default SavedSearchList;
