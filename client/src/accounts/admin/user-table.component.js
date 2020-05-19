import React from 'react';
import PropTypes from 'prop-types';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import ReactTooltip from 'react-tooltip';

import { ReactComponent as DeleteIcon } from './close.svg';
import { ReactComponent as CopyIcon } from './cog.svg';

import style from './user-table.module.css';

const EditableCell = ({ row, data, updateUser }) => (
  <div
    style={{ backgroundColor: '#fafafa' }}
    contentEditable
    suppressContentEditableWarning
    onBlur={event => {
      const newData = [...data];
      newData[row.index][row.column.id] = event.target.innerHTML;
      updateUser(newData.find(user => user.id === row.original.id));
    }}
    dangerouslySetInnerHTML={{
      __html: data[row.index][row.column.id],
    }}
  />
);

const UserTable = ({ data, deleteUser, updateUser, copyUser }) => (
  <div className={style.container}>
    {data && (
      <ReactTable
        noDataText="No Data Available"
        data={data}
        // filterable
        // defaultFilterMethod={(filter, row) =>
        //   String(row[filter.id]) === filter.value
        // }
        columns={[
          // { Header: 'ID', accessor: 'id' },
          {
            Header: 'Actions',
            accessor: 'action',
            maxWidth: 150,
            Cell: row => {
              return (
                <span>
                  <button onClick={() => copyUser(row.original)} data-tip data-for="copy-user">
                    <CopyIcon className={style.icon} alt="Copy" />
                  </button>
                  <ReactTooltip id="copy-user">
                    <span>Copy User</span>
                  </ReactTooltip>

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
          {
            Header: 'Key',
            id: 'id',
            accessor: d => d.id,
            contentEditable: true,
            filterable: true,
            filterMethod: (filter, row) => row[filter.id].startsWith(filter.value),
            Cell: row => {
              return <EditableCell row={row} data={data} updateUser={updateUser} />;
            },
          },
          {
            Header: 'Email',
            id: 'email',
            accessor: d => d.email,
            contentEditable: true,
            filterable: true,
            filterMethod: (filter, row) => row[filter.id].startsWith(filter.value),
            Cell: row => {
              return <EditableCell row={row} data={data} updateUser={updateUser} />;
            },
          },
          {
            Header: 'Name',
            id: 'name',
            accessor: d => d.name,
            contentEditable: true,
            filterable: true,
            filterMethod: (filter, row) => row[filter.id].startsWith(filter.value),
            Cell: row => {
              return <EditableCell row={row} data={data} updateUser={updateUser} />;
            },
          },
        ]}
        defaultPageSize={5}
        className="-striped -highlight"
      />
    )}
  </div>
);

UserTable.propTypes = {
  data: PropTypes.array,
  deleteUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  copyUser: PropTypes.func.isRequired,
};

export default UserTable;
