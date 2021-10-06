import React from 'react';

import {
  TextField,
  Typography,
  Link,
  LinearProgress as BaseLinearProgress,
  styled,
  IconButton,
} from '@astrosat/astrosat-ui';

import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

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

const LinearProgress = styled(BaseLinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: '100vh',
  [`&.MuiLinearProgress-colorPrimary`]: {
    backgroundColor: theme.palette.grey[500],
  },
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: '100vh',
    backgroundColor: theme.palette.info.main,
  },
}));

const FormWrapper = styled('form')(({ theme }) => ({
  display: 'grid',
  gridAutoFlow: 'row',
  rowGap: theme.spacing(2),
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

export const Form = () => {
  const [uploadStatus] = React.useState('idle');

  return (
    <FormWrapper>
      <FileDrop>
        <Typography variant="h1" component="label" gutterBottom>
          Drop the file here or <Link variant="inherit">Browse</Link>
        </Typography>
        <Typography variant="h4" component="p" paragraph>
          Only supported files will be processed.
        </Typography>
        <UploadIcon>
          <CsvIcon />
        </UploadIcon>
      </FileDrop>
      <LinearProgress variant="determinate" value={50} />
      <UploadControls>
        <Typography variant="h3" component="p">
          {uploadStatus === 'success'
            ? 'Uploaded'
            : uploadStatus === 'error'
            ? 'Invalid'
            : uploadStatus === 'pending'
            ? 'Uploading filename.csv'
            : 'No file available'}
        </Typography>
        <IconButton
          style={{
            color:
              uploadStatus === 'success'
                ? 'lime'
                : uploadStatus === 'error'
                ? 'red'
                : null,
          }}
          size="small"
          disabled={uploadStatus === 'idle'}
        >
          {uploadStatus === 'success' ? <CheckCircleIcon /> : <CancelIcon />}
        </IconButton>
      </UploadControls>
      <TextField label="Name Your Data" required />
      <TextField label="Add a Description for Your Data" />
    </FormWrapper>
  );
};
