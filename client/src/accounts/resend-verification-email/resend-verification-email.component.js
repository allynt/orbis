import React from 'react';

import {
  Button,
  CircularProgress,
  Grid,
  Link,
  Typography,
} from '@astrosat/astrosat-ui';

import { Link as RouterLink } from 'react-router-dom';

import { LOGIN } from 'accounts/accounts.constants';

/**
 * @param {{
 *   email?: string
 *   isLoading?: boolean
 *   onResend?: (event: React.MouseEvent<HTMLButtonElement>) => void
 * }} props
 */
const ResendVerificationEmail = ({ email, isLoading = false, onResend }) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Typography variant="h2" gutterBottom>
        Check your email
      </Typography>
      <Typography paragraph>
        We have created an Astrosat ID for your email
        {email ? <b> {email}</b> : ''}. You should have received an email
        containing a validation link which will allow you to create your
        account.
      </Typography>
      <Typography variant="h2" gutterBottom>
        You haven’t received the email?
      </Typography>
      <Typography paragraph>Please check your spam or bulk folders.</Typography>
    </Grid>
    <Grid item xs={12} container justifyContent="center">
      <Button onClick={onResend}>
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Resend email'
        )}
      </Button>
    </Grid>
    <Grid item xs={12} container justifyContent="center">
      <Link
        // @ts-ignore
        to={`/accounts${LOGIN}`}
        component={RouterLink}
      >
        Return to login
      </Link>
    </Grid>
  </Grid>
);

export default ResendVerificationEmail;
