import React from 'react';

import {
  Input,
  MagnifierIcon,
  Typography,
  makeStyles,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  layerSearch: {
    padding: theme.spacing(2, 4),
  },
  icon: {
    color: theme.palette.primary.light,
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
    <div className={styles.layerSearch}>
      <Input
        startAdornment={<MagnifierIcon className={styles.icon} />}
        onChange={onChange}
        value={searchTerm}
        placeholder="Search for data layers"
        autoFocus
      />
      {noResults && (
        <Typography className={styles.noResultMessage}>
          No results found for this keyword
        </Typography>
      )}
    </div>
  );
};

export default LayerSearch;
