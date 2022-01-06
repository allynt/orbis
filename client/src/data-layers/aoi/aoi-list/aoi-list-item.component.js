import React from 'react';

import {
  Avatar,
  Button,
  Grid,
  ImageIcon,
  ListItem,
  ListItemAvatar,
  MenuItem,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import { InfoButtonTooltip, OptionsMenu } from 'components';

const useStyles = makeStyles(theme => ({
  avatar: {
    width: '4rem',
    height: '4rem',
    marginTop: '2px',
    marginRight: theme.spacing(2),
    boxShadow: theme.shadows['2'],
  },
  info: {
    // padding: theme.typography.pxToRem(10),
  },
  options: {
    '& svg': {
      fontSize: '0.8rem',
    },
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  exploreButton: {
    padding: '0.2rem',
  },
  listItem: {
    padding: '0px',
    alignItems: 'flex-start',
    margin: '1rem 0',
  },
}));

const AoiListItem = ({ aoi, selectAoi, editAoiDetails, deleteAoi }) => {
  const styles = useStyles();

  const { name, description, thumbnail } = aoi;

  return (
    <ListItem className={styles.listItem}>
      <ListItemAvatar>
        <Avatar
          className={styles.avatar}
          variant="rounded"
          src={thumbnail}
          alt={name}
        >
          <ImageIcon />
        </Avatar>
      </ListItemAvatar>

      <Grid container direction="column" spacing={1}>
        <Grid item>
          <Typography variant="h4">{name}</Typography>
          <Typography variant="h5">Distance Range 10 km</Typography>
        </Grid>

        <Grid item>
          <Button
            size="small"
            className={styles.exploreButton}
            onClick={() => selectAoi(aoi)}
          >
            Explore Area
          </Button>
        </Grid>
      </Grid>

      <Grid className={styles.buttons}>
        <InfoButtonTooltip
          iconButtonClassName={styles.info}
          tooltipContent={<div>{description || 'No description given'}</div>}
        />
        <OptionsMenu optionsButtonClassName={styles.options}>
          <MenuItem onClick={() => editAoiDetails(aoi)}>Edit Details</MenuItem>
          <MenuItem onClick={() => deleteAoi(aoi)}>Delete</MenuItem>
        </OptionsMenu>
      </Grid>
    </ListItem>
  );
};

export default AoiListItem;
