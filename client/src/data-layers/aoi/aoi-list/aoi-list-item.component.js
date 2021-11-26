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
    width: 58,
    height: 58,
    marginRight: theme.spacing(2),
    boxShadow: theme.shadows['2'],
  },
  info: {
    padding: theme.typography.pxToRem(10),
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const AoiListItem = ({ aoi, selectAoi, editAoiDetails, deleteAoi }) => {
  const styles = useStyles();

  const { name, description, thumbnail } = aoi;

  return (
    <ListItem>
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
        <Grid item xs={8}>
          <Typography variant="h4">{name}</Typography>
        </Grid>

        <Grid item xs={4}>
          <Button size="small" onClick={() => selectAoi(aoi)}>
            Explore Area
          </Button>
        </Grid>
      </Grid>

      <Grid container className={styles.buttons}>
        <InfoButtonTooltip
          iconButtonClassName={styles.info}
          tooltipContent={<div>{description || 'No description given'}</div>}
        />
        <OptionsMenu>
          <MenuItem onClick={() => editAoiDetails(aoi)}>Edit Details</MenuItem>
          <MenuItem onClick={() => deleteAoi(aoi)}>Delete</MenuItem>
        </OptionsMenu>
      </Grid>
    </ListItem>
  );
};

export default AoiListItem;
