import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import UserTable from './user-table.component';
import UserDetailForm from './user-detail-form.component';

import styles from './user-list.module.css';

const UserList = ({ users, createUser, deleteUser, updateUser, copyUser }) => {
  const [isNewUserMode, setIsNewUserMode] = useState(false);

  return (
    <div className={styles['table-container']}>
      <h3>Maintain Users</h3>

      <p className={styles.strapline}>
        <strong>NOTE:</strong> Use actions within table to update user(s)
      </p>

      {users && <UserTable data={users} deleteUser={deleteUser} updateUser={updateUser} copyUser={copyUser} />}

      <Button onClick={() => setIsNewUserMode(!isNewUserMode)}>New User</Button>

      {isNewUserMode && <UserDetailForm createUser={createUser} />}
    </div>
  );
};

UserList.propTypes = {
  users: PropTypes.array,
  createUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  copyUser: PropTypes.func.isRequired,
};

export default UserList;
