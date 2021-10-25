import * as React from 'react';

import {
  Card,
  CardContent,
  CardMedia,
  alpha,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import { format } from 'date-fns';

import { DATE_FORMAT } from '../landing-constants';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: '17rem',
    background: 'transparent',
    boxShadow: 'none',
  },
  media: {
    height: theme.typography.pxToRem(190),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    opacity: 0.7,
    transition: theme.transitions.create('opacity'),
    '&:hover, &:focus': {
      opacity: 1,
      outline: 'none',
    },
    '&:hover': {
      cursor: 'pointer',
    },
  },
  subtitle: {
    color: alpha(theme.palette.text.primary, 0.7),
  },
}));

/**
 * @param {{
 *   bookmark: import('typings').Bookmark
 *   onClick?: (bookmark: import('typings').Bookmark) => void
 * }} props
 */
export const BookmarksListItem = ({ bookmark, onClick }) => {
  const styles = useStyles();
  const date = !!bookmark && format(new Date(bookmark?.created), DATE_FORMAT);

  return (
    <Card className={styles.card}>
      <CardMedia
        role="button"
        tabIndex={0}
        className={styles.media}
        image={bookmark?.thumbnail}
        onClick={() => onClick(bookmark)}
        onKeyUp={() => onClick(bookmark)}
        title={bookmark?.title}
      />
      <CardContent>
        <Typography variant="h2">{bookmark?.title}</Typography>
        <Typography
          variant="subtitle1"
          className={styles.subtitle}
        >{`Created ${date}`}</Typography>
      </CardContent>
    </Card>
  );
};
