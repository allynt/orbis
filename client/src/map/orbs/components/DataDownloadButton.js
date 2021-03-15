import { Button, makeStyles } from '@astrosat/astrosat-ui';
import React from 'react';
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
  const styles = useStyles();
  const dataToken = useSelector(selectDataToken);

  if (!url) {
    console.warn('`url` prop must be specified on DataDownloadButton');
    return null;
  }

  const handleClick = async () => {
    getData(url, {
      Authorization: `Bearer ${dataToken}`,
    })
      .then(result => result.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.${fileExtension}`;
        const clickHandler = function () {
          setTimeout(() => {
            URL.revokeObjectURL(url);
            this.removeEventListener('click', clickHandler);
            (this.remove && (this.remove(), 1)) ||
              (this.parentNode && this.parentNode.removeChild(this));
          }, 150);
        };
        a.addEventListener('click', clickHandler, false);
        a.click();
        return a;
      });
  };

  return (
    <Button
      className={styles.button}
      startIcon={<GetApp />}
      onClick={handleClick}
      color="secondary"
      size="small"
    >
      {buttonText}
    </Button>
  );
};
