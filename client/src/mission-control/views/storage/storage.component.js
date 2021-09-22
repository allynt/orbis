import React, { useMemo, useCallback, useState, useEffect } from 'react';

import {
  MenuItem,
  Dialog,
  styled,
  IconButton,
  DialogTitle,
  DialogContent,
  CloseIcon,
} from '@astrosat/astrosat-ui';

import { format } from 'date-fns';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useSortBy } from 'react-table';

import apiClient from 'api-client';
import { fetchSources } from 'data-layers/data-layers.slice';
import { Table } from 'mission-control/shared-components/mission-control-table';
import { Wrapper } from 'mission-control/shared-components/wrapper.component';

import { OptionsMenu } from '../users-view/options-menu.component';
import { DeleteFileForm } from './forms/delete-file-form.component';

const DialogCloseButton = styled(IconButton)({
  position: 'absolute',
  right: 0,
});

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
        <DialogCloseButton onClick={close} aria-label="Close">
          <CloseIcon />
        </DialogCloseButton>
        <DialogTitle>Delete File</DialogTitle>
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

export default () => {
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
