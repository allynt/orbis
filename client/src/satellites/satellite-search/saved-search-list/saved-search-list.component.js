import React from 'react';

import {
  Button,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
  Divider,
} from '@astrosat/astrosat-ui';

import PropTypes from 'prop-types';

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

const SavedSearchList = ({
  savedSearches,
  setCurrentSearchQuery,
  deleteSavedSatelliteSearch,
}) => {
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
              <Button
                size="small"
                onClick={() => setCurrentSearchQuery(search)}
              >
                Reload
              </Button>
              <Button
                size="small"
                color="secondary"
                onClick={() => deleteSavedSatelliteSearch(search.id)}
              >
                Delete
              </Button>
            </ListItem>
          );
        })}
    </List>
  );
};

SavedSearchList.propTypes = {
  savedSearches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      satellites: PropTypes.array,
      tiers: PropTypes.array,
      start_date: PropTypes.string,
      end_date: PropTypes.string,
      aoi: PropTypes.array,
      owner: PropTypes.number,
      created: PropTypes.string,
    }),
  ),
};

export default SavedSearchList;
