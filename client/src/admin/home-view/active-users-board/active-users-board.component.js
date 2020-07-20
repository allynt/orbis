import React, { useState } from 'react';

import { OptionsIcon } from '@astrosat/astrosat-ui';

import ContentWrapper from '../../content-wrapper.component';

import { getUserLicences } from '../get-user-licences-helper';

import QuickView from '../active-users-board/quick-view/quick-view.component';

import tableStyles from '../../table.module.css';

export const ActiveUsersBoard = ({
  activeUsers,
  customer,
  licenceData,
  onDeleteUserClick,
}) => {
  const [userOptions, setUserOptions] = useState(null);

  const handleClick = (fn, user) => {
    fn(user);
    setUserOptions(null);
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
          </tr>
        </thead>
        <tbody>
          {activeUsers && activeUsers.length > 0 ? (
            activeUsers.map(user => {
              const selected = userOptions === user;
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
                  <td
                    className={`${tableStyles.td} ${tableStyles.optionsColumn}`}
                  >
                    <OptionsIcon
                      classes={`${tableStyles.optionsIcon} ${
                        selected && tableStyles.optionsIconSelected
                      }`}
                      onClick={() => setUserOptions(selected ? null : user)}
                    />
                    {selected && (
                      <div className={tableStyles.optionsDropdown}>
                        <p
                          className={tableStyles.optionsText}
                          onClick={() => handleClick(console.log, user)}
                        >
                          Edit
                        </p>
                        <p
                          className={tableStyles.optionsText}
                          onClick={() => handleClick(onDeleteUserClick, user)}
                        >
                          Delete User
                        </p>
                      </div>
                    )}
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
