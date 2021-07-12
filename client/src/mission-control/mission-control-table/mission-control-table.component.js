import { TableCell, withStyles } from '@astrosat/astrosat-ui';

export const UsersViewTableCell = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    padding: '0',
    margin: '2rem 0',
  },
  head: {
    ...theme.typography.h2,
  },
  body: {
    ...theme.typography.body1,
    padding: '0',
  },
  stickyHeader: {},
}))(TableCell);
