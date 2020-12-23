import React from 'react';

import {
  Box,
  Button,
  makeStyles,
  Paper,
  Typography,
} from '@astrosat/astrosat-ui';

import OrbisAdminIcon from '../../orbis-admin-icon.svg';
import { ADMIN_VIEW } from '../admin.constants';

const useStyles = makeStyles(theme => ({
  logo: {
    cursor: 'pointer',
    width: theme.typography.pxToRem(168),
    height: theme.typography.pxToRem(152),
    display: 'grid',
    placeItems: 'center',
    objectFit: 'cover',
  },
  name: {
    cursor: 'pointer',
    margin: `${theme.typography.pxToRem(
      theme.spacing(4),
    )} 0 ${theme.typography.pxToRem(theme.spacing(3))}`,
  },
}));

/**
 * @param {{
 *   customer?: { logo?: string, name?: string },
 *   setVisiblePanel?: (panel: string) => void,
 *   onCreateUserClick?: () => void
 * }} props
 */
const OrganisationMenu = (
  { customer, setVisiblePanel, onCreateUserClick },
  ref,
) => {
  const styles = useStyles();
  return (
    <Box
      ref={ref}
      display="flex"
      flexDirection="column"
      flexShrink={0}
      mt="4.375rem"
      mx={2}
      alignItems="center"
      width="max-content"
    >
      <Paper
        className={styles.logo}
        onClick={() => setVisiblePanel(ADMIN_VIEW.corporateAccount)}
        component="img"
        src={customer?.logo || OrbisAdminIcon}
        alt={customer?.logo ? `${customer?.name} Logo` : 'The Orbis Icon'}
      />
      <Typography
        className={styles.name}
        variant="h2"
        onClick={() => setVisiblePanel(ADMIN_VIEW.corporateAccount)}
      >
        {customer?.name}
      </Typography>
      <Button size="small" onClick={onCreateUserClick}>
        Create User
      </Button>
    </Box>
  );
};

export default React.forwardRef(OrganisationMenu);
