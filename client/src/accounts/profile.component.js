import React from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import UpdateUserForm from './update-user-form.component';
import { updateUser, logout } from './accounts.actions';

import styles from './profile.module.css';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.accounts.user);

  return (
    <div className={styles.profile}>
      <UpdateUserForm user={user} updateUser={updateUser} />

      <Button theme="tertiary" classNames={[styles.logoutButton]} onClick={() => dispatch(logout())}>
        Logout
      </Button>
    </div>
  );
};

Profile.propTypes = {};

export default Profile;
