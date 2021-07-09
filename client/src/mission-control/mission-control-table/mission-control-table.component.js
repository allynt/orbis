import { TableCell, withStyles } from '@astrosat/astrosat-ui';

export const UsersViewTableCell = withStyles(theme => ({
  root: {
    padding: theme.spacing(5, 3),
    backgroundColor: theme.palette.background.default,
  },
  head: {
    ...theme.typography.h2,
  },
  body: {
    ...theme.typography.body1,
  },
  stickyHeader: {},
}))(TableCell);
