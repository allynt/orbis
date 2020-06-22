import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import UserTable from './user-table.component';
import UserDetailForm from './user-detail-form.component';
import ContentWrapper from './content-wrapper.component';

import styles from './user-list.module.css';

const UserList = ({
  title,
  users,
  customer,
  createCustomerUser,
  deleteCustomerUser,
  updateCustomerUser,
  copyCustomerUser,
}) => {
  const [isNewUserMode, setIsNewUserMode] = useState(false);

  return (
    <ContentWrapper title={title}>
      <div className={styles['table-container']}>
        <h3>Maintain Users</h3>

        <p className={styles.strapline}>
          <strong>NOTE:</strong> Use actions within table to update user(s)
        </p>

        {users && (
          <UserTable
            data={users}
            deleteCustomerUser={deleteCustomerUser}
            updateCustomerUser={updateCustomerUser}
            copyCustomerUser={copyCustomerUser}
          />
        )}

        <Button onClick={() => setIsNewUserMode(!isNewUserMode)}>New User</Button>

        {isNewUserMode && <UserDetailForm customer={customer} createCustomerUser={createCustomerUser} />}
      </div>
    </ContentWrapper>
  );
};

UserList.propTypes = {
  users: PropTypes.array,
  createCustomerUser: PropTypes.func.isRequired,
  deleteCustomerUser: PropTypes.func.isRequired,
  updateCustomerUser: PropTypes.func.isRequired,
  copyCustomerUser: PropTypes.func.isRequired,
};

export default UserList;
