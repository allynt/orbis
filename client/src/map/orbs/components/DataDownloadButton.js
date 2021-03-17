import { Button, CircularProgress, makeStyles } from '@astrosat/astrosat-ui';
import { GetApp } from '@material-ui/icons';
import { userSelector } from 'accounts/accounts.selectors';
import { ADMIN_STATUS } from 'admin/admin.constants';
import { selectDataToken } from 'data-layers/data-layers.slice';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getData } from 'utils/http';
import { saveAs } from 'file-saver';

const useStyles = makeStyles({
  button: {
    margin: '0 auto',
  },
});

/**
 * @type {import('typings/orbis').SidebarComponent<{
 *  url: string
 *  fileName?: string
 *  fileExtension?: string
 *  buttonText?: string
 *  adminOnly?: boolean
 * }>}
 */
export default ({
  url,
  fileName = 'orbis-download',
  fileExtension = 'csv',
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
    const blob = await response.blob();
    saveAs(
      blob,
      `${fileName}-${format(new Date(), 'yyyyMMdd')}.${fileExtension}`,
    );
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
