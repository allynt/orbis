import { TableCell, withStyles } from '@astrosat/astrosat-ui';

export const AdminTableCell = withStyles(theme => ({
  root: {
    padding: `${theme.typography.pxToRem(
      theme.spacing(5),
    )} ${theme.typography.pxToRem(theme.spacing(3))}`,
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
