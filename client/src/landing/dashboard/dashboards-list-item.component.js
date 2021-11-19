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

// import { DATE_FORMAT } from '../bookmarks-landing/landing-constants';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: '17rem',
    background: 'transparent',
    boxShadow: 'none',
  },
  media: {
    height: theme.typography.pxToRem(390),
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

/**
 * @param {{
 *   dashboard: import('typings').Dashboard
 *   onClick?: (dashboard: import('typings').Bookmark) => void
 * }} props
 */

// replace bookmark with dashboard
// export const DashBoardListItem = ({ bookmark, onClick }) => {
//   const styles = useStyles();
//   const date = !!bookmark && format(new Date(bookmark?.created), DATE_FORMAT);

//   return (
//     <Card className={styles.card}>
//       <CardMedia
//         role="button"
//         tabIndex={0}
//         className={styles.media}
//         image={bookmark?.thumbnail}
//         onClick={() => onClick(bookmark)}
//         onKeyUp={() => onClick(bookmark)}
//         title={bookmark?.title}
//       />
//       <CardContent>
//         <Typography variant="h2">{bookmark?.title}</Typography>
//         <Typography
//           variant="subtitle1"
//           className={styles.subtitle}
//         >{`Created ${date}`}</Typography>
//       </CardContent>
//     </Card>
//   );
// };

export const DashBoardListItem = ({ dashboard, onClick }) => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardMedia
        role="button"
        tabIndex={0}
        className={styles.media}
        image={dashboard?.thumbnail}
        onClick={() => onClick(dashboard)}
        onKeyUp={() => onClick(dashboard)}
        title={dashboard?.title}
      />
      <CardContent>
        <Typography variant="h2">{dashboard?.title}</Typography>
      </CardContent>
    </Card>
  );
};
