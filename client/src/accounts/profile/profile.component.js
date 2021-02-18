import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, Link, Typography } from '@astrosat/astrosat-ui';

import UpdateUserForm from '../update-user-form/update-user-form.component';
import { updateUser, logout } from '../accounts.slice';
import { userSelector } from '../accounts.selectors';
import { TERMS } from 'legal-documents/legal-documents-constants';

const LINKS = [
  {
    prefix: 'Need help? Contact us',
    url: 'https://share.hsforms.com/1U1g8jQnFQ2ej1lyaDcncfA4cctf',
    text: 'here',
  },
  {
    prefix: 'Read our',
    url: TERMS,
    text: 'Terms & Conditions',
  },
];

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
        {LINKS.map(link => (
          <Typography key={link.text} paragraph>
            {link.prefix}&nbsp;
            <Link href={link.url} rel="noopener noreferrer" target="_blank">
              {link.text}
            </Link>
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default Profile;
