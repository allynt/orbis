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

// TODO: update types when dashboards data available

/**
 * @param {{
 *   item: import('typings').Bookmark
 *   title: string
 *   onClick?: (item: import('typings').Bookmark) => void
 * }} props
 */
export const ContentListItem = ({ item, title, onClick }) => {
  const styles = useStyles();
  const date = !!item?.created && format(new Date(item?.created), DATE_FORMAT);
  return (
    <Card className={styles.card}>
      <CardMedia
        role="button"
        tabIndex={0}
        className={styles.media}
        image={item?.thumbnail}
        onClick={() => onClick(item)}
        onKeyUp={() => onClick(item)}
        title={item?.title}
      />
      <CardContent>
        <Typography variant="h2">{title}</Typography>
        {date ? (
          <Typography
            variant="subtitle1"
            className={styles.subtitle}
          >{`Created ${date}`}</Typography>
        ) : null}
      </CardContent>
    </Card>
  );
};
