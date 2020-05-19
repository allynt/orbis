import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useTable, usePagination } from 'react-table';

import ReactTooltip from 'react-tooltip';

import { ReactComponent as DeleteIcon } from './close.svg';
import { ReactComponent as CopyIcon } from './cog.svg';

import style from './user-table.module.css';

const EditableCell = ({ value: initialValue, row, column: { id }, updateUser }) => {
  const [value, setValue] = useState(initialValue || '');
  const onChange = event => setValue(event.target.value);

  // Only update the external data when the input is blurred
  const onBlur = () => {
    if (id) {
      updateUser({ ...row.original, [id]: value });
    }
  };

  // If the initialValue is changed externally, sync it up with our state
  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
    }
  }, [initialValue]);

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
            Cell: ({ row }) => (
              <span>
                <button onClick={() => copyUser(row.original)} data-tip data-for="copy-user">
                  <CopyIcon className={style.icon} alt="Copy" />
                </button>
                <ReactTooltip id="copy-user">
                  <span>Copy User</span>
                </ReactTooltip>
              </span>
            ),
          },
          {
            Header: 'Delete User',
            Cell: ({ row }) => (
              <span>
                <button onClick={() => deleteUser(row.original.id)} data-tip data-for="delete-user">
                  <DeleteIcon className={style.icon} alt="Delete" />
                </button>
                <ReactTooltip id="delete-user">
                  <span>Delete User</span>
                </ReactTooltip>
              </span>
            ),
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      updateUser,
    },
    usePagination,
  );

  // Render the UI for your table
  return (
    <>
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
          {page &&
            page.map(row => {
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

      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        <span>
          Page
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <span>
          | Go to page:
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>
        <select
          value={pageSize}
          onChange={event => {
            setPageSize(Number(event.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

UserTable.propTypes = {
  data: PropTypes.array,
  deleteUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  copyUser: PropTypes.func.isRequired,
};

export default UserTable;
