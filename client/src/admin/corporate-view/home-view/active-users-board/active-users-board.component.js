import React, { useState } from 'react';

import { Button, OptionsIcon } from '@astrosat/astrosat-ui';

import ContentWrapper from '../../../content-wrapper.component';
import OptionsDropdown from '../options-dropdown/options-dropdown.component';

import { getUserLicences, getLicenceInfo } from '../../../licence-utils';
import { ADMIN_STATUS } from '../../../admin.constants';

import QuickView from './quick-view/quick-view.component';

import styles from './active-users-board.module.css';
import tableStyles from '../../table.module.css';

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

  const CHANGE_ROLE = 'Change Role';
  const OPTIONS = 'Options';
  const USER_LABELS = {
    standard: 'Standard',
    admin: 'Admin',
  };

  const handleClick = (fn, user) => {
    fn(user);
    setDropdown(null);
  };

  return (
    <ContentWrapper title="Users">
      <QuickView data={quickViewData} />
      <div className={tableStyles.scroll}>
        <table className={tableStyles.table}>
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
                  <tr key={user.id} className={tableStyles.tr}>
                    <td className={tableStyles.td}>{user.user.name}</td>
                    <td className={tableStyles.td}>
                      {getLicenceInfo(licences)}
                    </td>
                    <td className={tableStyles.td}>{user.user.email}</td>
                    <td
                      className={`${tableStyles.td} ${tableStyles.optionsColumn}`}
                    >
                      <Button
                        theme="tertiary"
                        className={styles.optionsRoleButton}
                        onClick={() =>
                          setDropdown(
                            changeRoleSelected
                              ? null
                              : { type: CHANGE_ROLE, user },
                          )
                        }
                        disabled={
                          user.type === ADMIN_STATUS.manager &&
                          oneAdminRemaining
                        }
                      >
                        {user.type === ADMIN_STATUS.manager
                          ? USER_LABELS.admin
                          : USER_LABELS.standard}
                        <span
                          className={`${styles.arrow} ${
                            changeRoleSelected && styles.selected
                          }`}
                        ></span>
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
                    <td
                      className={`${tableStyles.td} ${tableStyles.optionsColumn}`}
                    >
                      <OptionsIcon
                        data-testid="options-icon"
                        classes={`${tableStyles.optionsIcon} ${
                          optionsSelected && tableStyles.optionsIconSelected
                        }`}
                        onClick={() =>
                          setDropdown(
                            optionsSelected ? null : { type: OPTIONS, user },
                          )
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
                              onClick={() =>
                                handleClick(onDeleteUserClick, user)
                              }
                            >
                              Delete User
                            </button>
                          )}
                        </OptionsDropdown>
                      )}
                    </td>
                  </tr>
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
    </ContentWrapper>
  );
};
