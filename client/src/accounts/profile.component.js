import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import UpdateUserForm from './update-user-form.component';
import { updateUser, logout } from './accounts.slice';

import { TERMS_URL } from './accounts.constants';

import styles from './profile.module.css';
import sideMenuStyles from '../side-menu/side-menu.module.css';

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
  const user = useSelector(state => state.accounts.user);

  const updateUserProfile = user => dispatch(updateUser(user));

  return (
    <div className={styles.profile}>
      <UpdateUserForm user={user} updateUser={updateUserProfile} />

      <div className={`${sideMenuStyles.buttons} ${styles.profileButtons}`}>
        <Button
          classNames={[sideMenuStyles.button, styles.profileButton]}
          theme="tertiary"
          onClick={() => dispatch(logout())}
          data-testid="logout"
        >
          Logout
        </Button>
      </div>

      <div className={styles.linkContainer}>
        {LINKS.map(link => (
          <span key={link.text} className={styles.links}>
            {link.prefix}
            <Button classNames={[styles.link]} href={link.url} rel="noopener noreferrer" target="_blank">
              {link.text}
            </Button>
          </span>
        ))}
      </div>
    </div>
  );
};

Profile.propTypes = {};

export default Profile;
