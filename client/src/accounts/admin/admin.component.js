import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

import AdminSideMenu from './admin-side-menu.component';
import UserList from './user-list.component';

import styles from './admin.module.css';

export const HOME = 'home';
export const ACTIVITY_LOG = 'activity-log';

const Admin = ({ user, users, fetchUsers, createUser, updateUser, copyUser, deleteUser }) => {
  const [visiblePanel, setVisiblePanel] = useState(HOME);
  return (
    <div className={styles.adminConsole}>
      <AdminSideMenu user={user} setVisiblePanel={setVisiblePanel} />
      <div className={styles.contentPanel}>
        {visiblePanel === HOME && (
          <UserList
            user={user}
            users={users}
            fetchUsers={fetchUsers}
            createUser={createUser}
            updateUser={updateUser}
            copyUser={copyUser}
            deleteUser={deleteUser}
          />
        )}
        {visiblePanel === ACTIVITY_LOG && <div>ACTIVITY LOG GOES HERE</div>}
      </div>
      <div className={styles.rightMenu}>
        <div className={styles.companyInfo}>
          <picture>
            <img
              className={styles.companyLogo}
              src="https://www.logodesignlove.com/images/monograms/tesla-symbol.jpg"
              alt="Company Logo"
            />
          </picture>
          <h2>Tesla, Inc</h2>
        </div>
        <div className={styles.buttons}>
          <button>Button 1</button>
          <button>Button 2</button>
          <button>Button 3</button>
          <button>Button 4</button>
        </div>
      </div>
    </div>
  );
};

// const Admin = () => (
//   <div>
//     <ul className={styles.nav}>
//       <li>
//         <Link className={styles['nav-item']} to="/users">
//           Admin Users
//         </Link>
//       </li>
//       <li>
//         <Link className={styles['nav-item']} to="/others">
//           Admin Others
//         </Link>
//       </li>
//     </ul>
//   </div>
// );

export default Admin;
