import React from 'react';

import { Box, Button, Link, Typography } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import apiClient from 'api-client';

import { userSelector } from '../accounts.selectors';
import { updateUser, logout } from '../accounts.slice';
import UpdateUserForm from '../update-user-form/update-user-form.component';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  const updateUserProfile = user => dispatch(updateUser(user));

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={2}
    >
      <UpdateUserForm user={user} updateUser={updateUserProfile} />
      <Box mt={2} width="100%">
        <Button fullWidth color="secondary" onClick={() => dispatch(logout())}>
          Logout
        </Button>
      </Box>
      <Box mt={2}>
        <Typography>
          Need help? Contact us&nbsp;
          <Link
            href="https://share.hsforms.com/1U1g8jQnFQ2ej1lyaDcncfA4cctf"
            rel="noopener noreferrer"
            target="_blank"
          >
            here
          </Link>
        </Typography>
        <Typography>
          Read our&nbsp;
          <Link
            href={apiClient.documents.getTermsUrl('user_terms')}
            rel="noopener noreferrer"
            target="_blank"
          >
            Terms &amp; Conditions
          </Link>
          &nbsp;and our&nbsp;
          <Link
            href={apiClient.documents.privacyUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Privacy Policy
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Profile;
