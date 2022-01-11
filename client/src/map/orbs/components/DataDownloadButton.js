import React, { useState } from 'react';

import { Button, CircularProgress, makeStyles } from '@astrosat/astrosat-ui';

import { GetApp } from '@material-ui/icons';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { useSelector } from 'react-redux';

import { userSelector } from 'accounts/accounts.selectors';
import { selectDataToken } from 'data-layers/data-layers.slice';
import { ADMIN_STATUS } from 'mission-control/mission-control.constants';
import { getData } from 'utils/http';

const FILENAME_REGEX = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;

export const getFilenameFromHeader = headerString => {
  if (headerString && headerString.indexOf('attachment') !== -1) {
    const matches = FILENAME_REGEX.exec(headerString);
    if (matches !== null && matches[1]) {
      return matches[1].replace(/['"]/g, '');
    }
  }
  return undefined;
};

const useStyles = makeStyles({
  button: {
    margin: '0 auto',
  },
});

/**
 * @type {import('typings').SidebarComponent<{
 *  url: string
 *  fileName?: string
 *  fileExtension?: string
 *  buttonText?: string
 *  adminOnly?: boolean
 * }>}
 */
const DataDownloadButton = ({
  url,
  fileName: defaultFileName = 'orbis-download',
  fileExtension: defaultFileExtension = 'csv',
  buttonText = 'Export Data',
  adminOnly = true,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const styles = useStyles();
  const dataToken = useSelector(selectDataToken);
  const user = useSelector(userSelector);

  if (
    !url ||
    (adminOnly && !user.customers.some(c => c.type === ADMIN_STATUS.manager))
  ) {
    if (!url) {
      console.warn('`url` prop must be specified on DataDownloadButton');
    }
    return null;
  }

  const handleClick = async () => {
    setIsLoading(true);
    const response = await getData(url, {
      Authorization: `Bearer ${dataToken}`,
    });
    const filename =
      getFilenameFromHeader(response.headers.get('content-disposition')) ||
      `${defaultFileName}-${format(
        new Date(),
        'yyyyMMdd',
      )}.${defaultFileExtension}`;

    const blob = await response.blob();
    if (!!blob) {
      saveAs(blob, filename);
    }
    setIsLoading(false);
  };

  return (
    <Button
      className={styles.button}
      startIcon={
        isLoading ? <CircularProgress size={18} color="inherit" /> : <GetApp />
      }
      onClick={handleClick}
      color="secondary"
      size="small"
    >
      {buttonText}
    </Button>
  );
};

export default DataDownloadButton;
