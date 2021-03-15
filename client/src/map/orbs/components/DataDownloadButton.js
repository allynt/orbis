import { Button, CircularProgress, makeStyles } from '@astrosat/astrosat-ui';
import React, { useState } from 'react';
import { GetApp } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { selectDataToken } from 'data-layers/data-layers.slice';
import { getData } from 'utils/http';

const useStyles = makeStyles({
  button: {
    margin: '0 auto',
  },
});

export default ({
  url,
  fileName = 'orbis-download',
  fileExtension = 'csv',
  buttonText = 'Export Data',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const styles = useStyles();
  const dataToken = useSelector(selectDataToken);

  if (!url) {
    console.warn('`url` prop must be specified on DataDownloadButton');
    return null;
  }

  const handleClick = async () => {
    setIsLoading(true);
    const response = await getData(url, {
      Authorization: `Bearer ${dataToken}`,
    });
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = `${fileName}.${fileExtension}`;
    const clickHandler = function () {
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
        this.removeEventListener('click', clickHandler);
        (this.remove && (this.remove(), 1)) ||
          (this.parentNode && this.parentNode.removeChild(this));
        setIsLoading(false);
      }, 150);
    };
    a.addEventListener('click', clickHandler, false);
    a.click();
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
