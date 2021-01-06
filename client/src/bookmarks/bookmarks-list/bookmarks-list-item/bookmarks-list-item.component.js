import {
  Avatar,
  Box,
  Button,
  Grid,
  ImageIcon,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Paper,
  Typography,
} from '@astrosat/astrosat-ui';
import * as React from 'react';

const useStyles = makeStyles(theme => ({
  avatar: {
    width: 58,
    height: 58,
    marginRight: theme.spacing(2),
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
 *   bookmark: import('typings/orbis').Bookmark
 *   onSelect: (bookmark: import('typings/orbis').Bookmark) => void
 *   onDelete: (bookmark: import('typings/orbis').Bookmark) => void
 * }} props
 */
export const BookmarksListItem = ({ bookmark, onSelect, onDelete }) => {
  const styles = useStyles();

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar
          component={Paper}
          className={styles.avatar}
          variant="rounded"
          src={bookmark.thumbnail}
          alt={bookmark.title}
        >
          <ImageIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primaryTypographyProps={{
          variant: 'h4',
          className: styles.title,
          gutterBottom: true,
        }}
        primary={bookmark.title}
        secondary={
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography>{bookmark.description}</Typography>
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
        }
      />
    </ListItem>
  );
};
