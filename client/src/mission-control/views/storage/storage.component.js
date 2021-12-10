import React, { useMemo, useCallback, useState, useEffect } from 'react';

import {
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@astrosat/astrosat-ui';

import { format } from 'date-fns';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useSortBy } from 'react-table';

import apiClient from 'api-client';
import { OptionsMenu } from 'components/options-menu/options-menu.component';
import { Table } from 'components/table';
import { fetchSources } from 'data-layers/data-layers.slice';
import { Wrapper } from 'mission-control/shared-components/wrapper.component';

import { DeleteFileForm } from './forms/delete-file-form.component';

export const Storage = ({ files, setFiles }) => {
  const dispatch = useDispatch();
  const [fileId, setFileId] = useState(null);

  const close = () => setFileId(null);

  const onDeleteFileClick = async () => {
    try {
      await apiClient.storage.deleteFile(fileId);
      dispatch(fetchSources());
    } catch (error) {
      const { message, status } = error;
      NotificationManager.error(
        `${status} ${message}`,
        `Deleting Stored Data Error - ${message}`,
        50000,
        () => {},
      );
    }

    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);

    return setFileId(null);
  };

  const onDeleteFileButtonClick = useCallback(value => setFileId(value), []);

  const columns = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
      },
      {
        Header: 'Date',
        accessor: 'created',
        Cell: ({ value }) => format(new Date(value), 'dd-MM-yyyy'),
      },
      {
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ value }) => (
          <OptionsMenu>
            <MenuItem onClick={() => onDeleteFileButtonClick(value)}>
              Delete
            </MenuItem>
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
            padding: cell.column.id === 'id' ? 'checkbox' : 'inherit',
          })}
          tableOptions={{
            initialState: { sortBy: [{ id: 'date', desc: true }] },
            disableSortRemove: true,
            autoResetPage: false,
          }}
        />
      </Wrapper>
      <Dialog open={!!fileId} onClose={close} maxWidth="md">
        <DialogTitle onClose={close}>Delete File</DialogTitle>
        <DialogContent>
          <DeleteFileForm
            onDeleteFileClick={onDeleteFileClick}
            onCancelClick={close}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

const StorageWrapper = () => {
  const [files, setFiles] = useState(null);

  useEffect(() => {
    if (!files) {
      const fetchDocs = async () => {
        try {
          const storageFiles = await apiClient.storage.getFiles();
          setFiles(storageFiles);
        } catch (error) {
          /** @type {import('api-client').ResponseError} */
          const { message, status } = error;
          NotificationManager.error(
            `${status} ${message}`,
            `Fetching Stored Data Error - ${message}`,
            50000,
            () => {},
          );
        }
      };

      fetchDocs();
    }
  }, [files]);

  return <Storage files={files} setFiles={setFiles} />;
};

export default StorageWrapper;
