import * as React from 'react';

import {
  Avatar,
  Button,
  Grid,
  ImageIcon,
  ListItem,
  ListItemAvatar,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  avatar: {
    width: 58,
    height: 58,
    marginRight: theme.spacing(2),
    boxShadow: theme.shadows['2'],
  },
  title: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  button: {
    padding: '8px 16px',
  },
}));

/**
 * @param {{
 *   bookmark: import('typings').Bookmark
 *   onSelect: (bookmark: import('typings').Bookmark) => void
 *   onDelete: (bookmark: import('typings').Bookmark) => void
 * }} props
 */
export const BookmarksListItem = ({ bookmark, onSelect, onDelete }) => {
  const styles = useStyles();

  const { title, description, thumbnail } = bookmark;

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar
          className={styles.avatar}
          variant="rounded"
          src={thumbnail}
          alt={title}
        >
          <ImageIcon />
        </Avatar>
      </ListItemAvatar>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h4">{title}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>{description}</Typography>
        </Grid>
        <Grid item>
          <Button
            className={styles.button}
            size="small"
            onClick={() => onSelect(bookmark)}
          >
            Load
          </Button>
        </Grid>
        <Grid item>
          <Button
            className={styles.button}
            size="small"
            color="secondary"
            onClick={() => onDelete(bookmark)}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    </ListItem>
  );
};
