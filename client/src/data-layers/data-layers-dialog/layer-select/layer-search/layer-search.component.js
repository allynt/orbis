import React from 'react';

import {
  Input,
  MagnifierIcon,
  Typography,
  makeStyles,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  input: {
    margin: theme.spacing(2, 4),
  },
  noResultMessage: {
    textAlign: 'center',
    padding: theme.spacing(4),
    height: '100%',
  },
}));

const LayerSearch = ({ searchTerm = '', onChange, noResults }) => {
  const styles = useStyles();
  return (
    <>
      <Input
        className={styles.input}
        startAdornment={<MagnifierIcon color="primary" />}
        onChange={onChange}
        value={searchTerm}
        placeholder="Search for data layers"
        inputProps={{
          'aria-label': 'Search for data layers',
        }}
        fullWidth={false}
      />
      {noResults && (
        <Typography className={styles.noResultMessage}>
          No results found for this keyword
        </Typography>
      )}
    </>
  );
};

export default LayerSearch;
