import React from 'react';

import { Button, makeStyles, Typography } from '@astrosat/astrosat-ui';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    margin: '0 auto',
    marginTop: '1rem',
  },
});

const Aoi = ({ onDrawAoiClick }) => {
  const styles = useStyles();

  return (
    <div className={styles.wrapper}>
      <Typography variant="h3" component="h1">
        Search
      </Typography>
      <Typography paragraph>
        Please select the Area Of Interest on the map to earch for available
        data.
      </Typography>

      <Button
        color="secondary"
        onClick={onDrawAoiClick}
        className={styles.button}
      >
        Save
      </Button>
    </div>
  );
};

export default Aoi;
