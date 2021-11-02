import React from 'react';

import {
  IconButton,
  Link,
  styled,
  Typography,
  makeStyles,
} from '@astrosat/astrosat-ui';

import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import clsx from 'clsx';
import { useDropzone } from 'react-dropzone';

import { ReactComponent as CsvIcon } from '../intro/csv.svg';

const UploadIcon = styled('div')(({ theme }) => ({
  position: 'relative',
  border: `dashed 1px ${theme.palette.grey[500]}`,
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  maxWidth: '50px',
  aspectRatio: '1.4',
  padding: theme.spacing(1),
  '& svg': {
    maxWidth: '31px',
    position: 'absolute',
    right: -5,
    bottom: -5,
  },
}));

const FileDrop = styled('div')(({ theme }) => ({
  display: 'grid',
  gridAutoFlow: 'row',
  justifyItems: 'center',
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%23979797FF' stroke-width='4' stroke-dasharray='16' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
  borderRadius: '10px',
  padding: theme.spacing(2, 2, 3),
}));

const UploadControls = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr min-content',
  alignItems: 'center',
});

const useStyles = makeStyles(theme => ({
  iconButton: {
    '&$error': {
      color: theme.palette.error.main,
    },
    '&$success': {
      color: theme.palette.success.main,
    },
  },
  error: {},
  success: {},
}));

const Dropzone = ({ onChange, value, error, onClear }) => {
  const styles = useStyles();
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => onChange(acceptedFiles[0]),
  });

  return (
    <>
      <FileDrop {...getRootProps({ 'data-testid': 'dropzone' })}>
        <input
          {...getInputProps({
            id: 'file-input',
            'aria-labelledby': 'browse-link',
          })}
        />
        <Typography variant="h1" component="div" gutterBottom>
          Drop the file here or{' '}
          <Link
            id="browse-link"
            aria-controls="file-input"
            // @ts-ignore
            component="button"
            type="button"
            variant="h1"
          >
            Browse
          </Link>
        </Typography>
        <Typography variant="h4" component="p" paragraph>
          Only supported files will be processed.
        </Typography>
        <UploadIcon>
          <CsvIcon />
        </UploadIcon>
      </FileDrop>
      <UploadControls>
        <Typography
          variant="h3"
          component="p"
          color={error ? 'error' : 'inherit'}
          data-testid="file-error-message"
        >
          {error ? error.message : value ? value.name : 'No file available'}
        </Typography>
        <IconButton
          className={clsx(styles.iconButton, {
            [styles.success]: !!value && !error,
            [styles.error]: !!error,
          })}
          size="small"
          disabled={!value}
          onClick={onClear}
          aria-label="Clear file"
        >
          {!!value && !error ? <CheckCircleIcon /> : <CancelIcon />}
        </IconButton>
      </UploadControls>
    </>
  );
};

export { Dropzone };
