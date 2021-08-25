import React, { useMemo, useCallback, useState } from 'react';

import {
  MenuItem,
  Dialog,
  DialogCloseButton,
  DialogTitle,
  DialogContent,
  CloseIcon,
} from '@astrosat/astrosat-ui';

import { format } from 'date-fns';
import { useSortBy } from 'react-table';

import { DIALOG_VIEW } from 'mission-control/mission-control.constants';
import { Table } from 'mission-control/shared-components/mission-control-table';
import { Wrapper } from 'mission-control/shared-components/wrapper.component';

import { OptionsMenu } from '../users-view/options-menu.component';
import { DeleteFileForm } from './forms/delete-file-form';

const Storage = ({ files }) => {
  const [dialogForm, setDialogForm] = useState(null);

  const onDeleteFileClick = () => {
    return console.log('Delete clicked');
  };

  const onCancelClick = () => {
    return console.log('Cancel clicked');
  };

  /** @param { import('typings').CustomerUser } user */
  const onDeleteFileButtonClick = useCallback(
    user =>
      setDialogForm({
        type: DIALOG_VIEW.deleteFile,
        user,
      }),
    [],
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
      },
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ value }) => format(new Date(value), 'dd-MM-yyyy'),
      },
      {
        accessor: 'options',
        disableSortBy: true,
        Cell: () => (
          <OptionsMenu>
            <MenuItem onClick={onDeleteFileButtonClick}>Delete</MenuItem>
          </OptionsMenu>
        ),
      },
    ],
    [onDeleteFileButtonClick],
  );

  const data = useMemo(() => files ?? [], [files]);

  return (
    <>
      <Wrapper title="Storage">
        <Table
          columns={columns}
          data={data}
          noDataMessage="No Storage Data"
          pluginHooks={[useSortBy]}
          getCellProps={cell => ({
            padding: cell.column.id === 'options' ? 'checkbox' : 'inherit',
          })}
          tableOptions={{
            initialState: { sortBy: [{ id: 'date', desc: true }] },
            disableSortRemove: true,
            autoResetPage: false,
          }}
        />
      </Wrapper>
      <Dialog
        open={!!dialogForm}
        onClose={() => setDialogForm(null)}
        maxWidth="md"
      >
        <DialogCloseButton
          onClick={() => setDialogForm(null)}
          aria-label="Close"
        >
          <CloseIcon />
        </DialogCloseButton>
        <DialogTitle>{dialogForm?.type}</DialogTitle>
        <DialogContent>
          <DeleteFileForm
            onDeleteFileClick={onDeleteFileClick}
            onCancelClick={onCancelClick}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Storage;
