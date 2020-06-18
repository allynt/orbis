import React from 'react';

export const ActiveUsersBoard = ({ activeUsers }) => (
  <table>
    <thead>
      <th>User</th>
      <th>Activated Licences</th>
      <th>Email</th>
    </thead>
    <tbody>
      {activeUsers && activeUsers.length
        ? activeUsers.map(user => (
            <tr>
              <td>{user.name}</td>
              <td>{user.licences?.sort().join(', ')}</td>
              <td>{user.email}</td>
            </tr>
          ))
        : 'No Active Users'}
    </tbody>
  </table>
);
