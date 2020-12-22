import React, { useState } from 'react';

import { Button, OptionsIcon } from '@astrosat/astrosat-ui';

import OptionsDropdown from '../options-dropdown/options-dropdown.component';

import { getUserLicences, getLicenceInfo } from '../../licence-utils';
import { ADMIN_STATUS } from '../../admin.constants';

import QuickView from '../active-users-board/quick-view/quick-view.component';

import styles from './active-users-board.module.css';
import tableStyles from '../../table.module.css';

const CHANGE_ROLE = 'Change Role';
const OPTIONS = 'Options';
const USER_LABELS = {
  standard: 'Standard',
  admin: 'Admin',
};

const TableHeader = () => (
  <thead className={tableStyles.thead}>
    <tr className={tableStyles.theadr}>
      <th align="left" className={tableStyles.th}>
        User
      </th>
      <th align="left" className={tableStyles.th}>
        Activated Licences
      </th>
      <th align="left" className={tableStyles.th}>
        Email
      </th>
      <th align="left" className={tableStyles.th}>
        Type
      </th>
      <th align="left" className={tableStyles.th}></th>
    </tr>
  </thead>
);

const UserRow = ({
  user,
  licences,
  setDropdown,
  changeRoleSelected,
  oneAdminRemaining,
  handleClick,
  onChangeRoleClick,
  optionsSelected,
  currentUser,
  onEditUserClick,
  onDeleteUserClick,
}) => (
  <tr className={tableStyles.tr}>
    <td className={tableStyles.td}>{user.user.name}</td>
    <td className={tableStyles.td}>{getLicenceInfo(licences)}</td>
    <td className={tableStyles.td}>{user.user.email}</td>
    <td className={`${tableStyles.td} ${tableStyles.optionsColumn}`}>
      <Button
        color="secondary"
        className={styles.optionsRoleButton}
        onClick={() =>
          setDropdown(changeRoleSelected ? null : { type: CHANGE_ROLE, user })
        }
        disabled={user.type === ADMIN_STATUS.manager && oneAdminRemaining}
        endIcon={
          <span
            className={`${styles.arrow} ${
              changeRoleSelected && styles.selected
            }`}
          ></span>
        }
      >
        {user.type === ADMIN_STATUS.manager
          ? USER_LABELS.admin
          : USER_LABELS.standard}
      </Button>

      {changeRoleSelected && (
        <OptionsDropdown
          className={styles.roleDropdown}
          onClickAway={() => setDropdown(null)}
        >
          <button
            className={tableStyles.optionsButton}
            onClick={() => handleClick(onChangeRoleClick, user)}
          >
            {user.type === ADMIN_STATUS.manager
              ? USER_LABELS.standard
              : USER_LABELS.admin}
          </button>
        </OptionsDropdown>
      )}
    </td>
    <td className={`${tableStyles.td} ${tableStyles.optionsColumn}`}>
      <OptionsIcon
        data-testid="options-icon"
        classes={`${tableStyles.optionsIcon} ${
          optionsSelected && tableStyles.optionsIconSelected
        }`}
        onClick={() =>
          setDropdown(optionsSelected ? null : { type: OPTIONS, user })
        }
      />
      {optionsSelected && (
        <OptionsDropdown
          className={styles.editDropdown}
          onClickAway={() => setDropdown(null)}
        >
          <button
            className={tableStyles.optionsButton}
            onClick={() => handleClick(onEditUserClick, user)}
          >
            Edit
          </button>
          {user.user.id !== currentUser.id && (
            <button
              className={tableStyles.optionsButton}
              onClick={() => handleClick(onDeleteUserClick, user)}
            >
              Delete User
            </button>
          )}
        </OptionsDropdown>
      )}
    </td>
  </tr>
);

export const ActiveUsersBoard = ({
  currentUser,
  activeUsers,
  oneAdminRemaining,
  customer,
  quickViewData,
  onChangeRoleClick,
  onEditUserClick,
  onDeleteUserClick,
}) => {
  const [dropdown, setDropdown] = useState(null);

  const handleClick = (fn, user) => {
    fn(user);
    setDropdown(null);
  };

  return (
    <>
      <QuickView data={quickViewData} />
      <div className={tableStyles.scroll}>
        <table className={tableStyles.table}>
          <TableHeader />
          <tbody>
            {activeUsers && activeUsers.length > 0 ? (
              activeUsers.map(user => {
                const optionsSelected =
                  dropdown?.type === OPTIONS && dropdown.user === user;

                const changeRoleSelected =
                  dropdown?.type === CHANGE_ROLE && dropdown.user === user;

                let licences = null;
                if (customer && customer.licences) {
                  licences = getUserLicences(user, customer);
                }
                return (
                  <UserRow
                    key={user.id}
                    user={user}
                    changeRoleSelected={changeRoleSelected}
                    currentUser={currentUser}
                    handleClick={handleClick}
                    licences={licences}
                    onChangeRoleClick={onChangeRoleClick}
                    onDeleteUserClick={onDeleteUserClick}
                    onEditUserClick={onEditUserClick}
                    oneAdminRemaining={oneAdminRemaining}
                    optionsSelected={optionsSelected}
                    setDropdown={setDropdown}
                  />
                );
              })
            ) : (
              <tr className={tableStyles.tr}>
                <td align="center" colSpan={5} className={tableStyles.td}>
                  No Active Users
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
