import React from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import UpdateUserForm from './update-user-form.component';
import { updateUser, logout } from './accounts.actions';

import styles from './profile.module.css';
import sideMenuStyles from '../side-menu/side-menu.module.css';

const LINKS = [
  {
    prefix: 'Need help? Contact us',
    url: 'https://astrosat.on.spiceworks.com/portal/tickets',
    text: 'here'
  },
  {
    prefix: 'Read our',
    url: '/terms',
    text: 'Terms & Conditions'
  }
];

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.accounts.user);

  const updateUserProfile = user => dispatch(updateUser(user));

  return (
    <div className={styles.profile}>
      <UpdateUserForm user={user} updateUser={updateUserProfile} />

      <div className={`${sideMenuStyles.buttons} ${styles.profileButtons}`}>
        <Button classNames={[sideMenuStyles.button]} theme="tertiary" onClick={() => dispatch(logout())}>
          Logout
        </Button>
      </div>

      <div className={styles.linkContainer}>
        {LINKS.map(link => (
          <span className={styles.links}>
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
