import { TableCell, withStyles } from '@astrosat/astrosat-ui';

export const UsersViewTableCell = withStyles(theme => ({
  root: {
    padding: theme.spacing(5, 3),
  },
  head: {
    ...theme.typography.h2,
  },
  body: {
    ...theme.typography.body1,
  },
  stickyHeader: {
    backgroundColor: theme.palette.common.white,
  },
}))(TableCell);
