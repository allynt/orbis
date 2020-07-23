import React, { useState } from 'react';

import { Button, OptionsIcon } from '@astrosat/astrosat-ui';

import ContentWrapper from '../../content-wrapper.component';
import OptionsDropdown from '../options-dropdown/options-dropdown.component';

import { getUserLicences } from '../get-user-licences-helper';

import QuickView from '../active-users-board/quick-view/quick-view.component';

import tableStyles from '../../table.module.css';

export const ActiveUsersBoard = ({
  activeUsers,
  customer,
  licenceData,
  onChangeRoleClick,
  onDeleteUserClick,
}) => {
  const [dropdown, setDropdown] = useState(null);

  const oneAdminRemaining =
    activeUsers?.filter(au => au.type === 'MANAGER').length === 1;

  const handleClick = (fn, user) => {
    fn(user);
    setDropdown(null);
  };

  return (
    <ContentWrapper title="Users">
      <QuickView licenceData={licenceData} />
      <table className={tableStyles.table}>
        <thead className={tableStyles.thead}>
          <tr className={tableStyles.tr}>
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
                dropdown?.type === 'options' && dropdown.user === user;

              const changeRoleSelected =
                dropdown?.type === 'change-role' && dropdown.user === user;

              let licences = null;
              if (customer && customer.licences) {
                licences = getUserLicences(user, customer);
              }
              return (
                <tr key={user.id} className={tableStyles.tr}>
                  <td className={tableStyles.td}>{user.user.name}</td>
                  <td className={tableStyles.td}>
                    {licences
                      ? licences.slice().sort().join(', ')
                      : 'Not currently available'}
                  </td>
                  <td className={tableStyles.td}>{user.user.email}</td>
                  <td className={tableStyles.td}>
                    <div className={tableStyles.optionsContainer}>
                      <Button
                        theme="tertiary"
                        className={tableStyles.optionsRoleButton}
                        onClick={() =>
                          setDropdown(
                            changeRoleSelected
                              ? null
                              : { type: 'change-role', user },
                          )
                        }
                        disabled={user.type === 'MANAGER' && oneAdminRemaining}
                      >
                        {user.type === 'MANAGER' ? 'Admin' : 'Standard'}
                      </Button>

                      {changeRoleSelected && (
                        <div
                          className={`${tableStyles.optionsDropdown} ${tableStyles.roleDropdown}`}
                        >
                          <OptionsDropdown
                            textContent={
                              user.type === 'MANAGER' ? 'Standard' : 'Admin'
                            }
                            onClick={() => handleClick(onChangeRoleClick, user)}
                            close={() => setDropdown(null)}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={tableStyles.td}>
                    <div className={tableStyles.optionsContainer}>
                      <OptionsIcon
                        classes={`${tableStyles.optionsIcon} ${
                          optionsSelected && tableStyles.optionsIconSelected
                        }`}
                        onClick={() =>
                          setDropdown(
                            optionsSelected ? null : { type: 'options', user },
                          )
                        }
                      />
                      {optionsSelected && (
                        <div
                          className={`${tableStyles.optionsDropdown} ${tableStyles.editDropdown}`}
                        >
                          <OptionsDropdown
                            textContent="Edit"
                            onClick={() => handleClick(console.log, user)}
                            close={() => setDropdown(null)}
                          />
                          <OptionsDropdown
                            textContent="Delete User"
                            onClick={() => handleClick(onDeleteUserClick, user)}
                            close={() => setDropdown(null)}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr className={tableStyles.tr}>
              <td align="center" colSpan={3} className={tableStyles.td}>
                No Active Users
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </ContentWrapper>
  );
};
