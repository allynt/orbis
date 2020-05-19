import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useTable } from 'react-table';

import ReactTooltip from 'react-tooltip';

import { ReactComponent as DeleteIcon } from './close.svg';
import { ReactComponent as CopyIcon } from './cog.svg';

import style from './user-table.module.css';

const EditableCell = ({ value: initialValue, row, column: { id }, updateUser }) => {
  const initialState = initialValue || '';
  const [value, setValue] = useState(initialState);
  const onChange = event => {
    setValue(event.target.value);
  };

  // Only update the external data when the input is blurred
  const onBlur = () => {
    if (id) {
      updateUser({ ...row.original, [id]: value });
    }
  };

  // If the initialValue is changed externall, sync it up with our state
  useEffect(() => {
    setValue(initialState);
  }, [initialState]);

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

const defaultColumn = {
  Cell: EditableCell,
};

const UserTable = ({ data, deleteUser, updateUser, copyUser }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Actions',
        columns: [
          {
            Header: 'Copy User',
            Cell: ({ row }) => {
              // console.log('COPY CELL ROW: ', row);
              return (
                <span>
                  <button onClick={() => copyUser(row.original)} data-tip data-for="copy-user">
                    <CopyIcon className={style.icon} alt="Copy" />
                  </button>
                  <ReactTooltip id="copy-user">
                    <span>Copy User</span>
                  </ReactTooltip>
                </span>
              );
            },
          },
          {
            Header: 'Delete User',
            Cell: ({ row }) => {
              // console.log('DELETE CELL ROW: ', row);
              return (
                <span>
                  <button onClick={() => deleteUser(row.original.id)} data-tip data-for="delete-user">
                    <DeleteIcon className={style.icon} alt="Delete" />
                  </button>
                  <ReactTooltip id="delete-user">
                    <span>Delete User</span>
                  </ReactTooltip>
                </span>
              );
            },
          },
        ],
      },
      {
        Header: 'User Details',
        columns: [
          {
            Header: 'Key',
            accessor: 'id',
            Cell: ({ value }) => <span>{value}</span>,
          },
          {
            Header: 'Email',
            accessor: 'email',
          },
          {
            Header: 'Name',
            accessor: 'name',
          },
        ],
      },
    ],
    [copyUser, deleteUser],
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
    defaultColumn,
    updateUser,
  });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);

          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

UserTable.propTypes = {
  data: PropTypes.array,
  deleteUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  copyUser: PropTypes.func.isRequired,
};

export default UserTable;
