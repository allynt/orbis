import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@astrosat/astrosat-ui';

import UpdateUserForm from '../update-user-form/update-user-form.component';
import { updateUser, logout, userSelector } from '../accounts.slice';

import { TERMS_URL } from '../accounts.constants';

import styles from './profile.module.css';

const LINKS = [
  {
    prefix: 'Need help? Contact us',
    url: 'https://share.hsforms.com/1U1g8jQnFQ2ej1lyaDcncfA4cctf',
    text: 'here',
  },
  {
    prefix: 'Read our',
    url: TERMS_URL,
    text: 'Terms & Conditions',
  },
];

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  const updateUserProfile = user => dispatch(updateUser(user));

  return (
    <div className={styles.profile}>
      <UpdateUserForm user={user} updateUser={updateUserProfile} />
      <Button
        className={styles.logout}
        theme="tertiary"
        onClick={() => dispatch(logout())}
        data-testid="logout"
      >
        Logout
      </Button>

      {LINKS.map(link => (
        <p key={link.text} className={styles.p}>
          {link.prefix}
          <Button
            className={styles.link}
            href={link.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {link.text}
          </Button>
        </p>
      ))}
    </div>
  );
};

Profile.propTypes = {};

export default Profile;
