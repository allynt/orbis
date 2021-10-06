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

import { ReactComponent as CsvIcon } from '../intro/csv.svg';

const UploadIcon = styled('div')({
  position: 'relative',
  border: 'dashed 1px #979797',
  borderRadius: '5px',
  width: '100%',
  maxWidth: '50px',
  aspectRatio: '1.4',
  padding: '8px 7px',
  '& svg': {
    maxWidth: '31px',
    position: 'absolute',
    right: -5,
    bottom: -5,
  },
});

const LinearProgress = styled(BaseLinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.MuiLinearProgress-colorPrimary`]: {
    backgroundColor: theme.palette.grey[500],
  },
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.info.main,
  },
}));

const FormWrapper = styled('form')({
  display: 'grid',
  gridAutoFlow: 'row',
  rowGap: '20px',
});

const FileDrop = styled('div')({
  display: 'grid',
  gridAutoFlow: 'row',
  justifyItems: 'center',
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%23979797FF' stroke-width='4' stroke-dasharray='16' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
  borderRadius: '10px',
  padding: '20px 20px 30px',
});

const UploadControls = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr min-content',
  alignItems: 'center',
});

export const Form = () => (
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
        Uploading
      </Typography>
      <IconButton size="small">
        <CancelIcon />
      </IconButton>
    </UploadControls>
    <TextField label="Name Your Data" required />
    <TextField label="Add a Description for Your Data" />
  </FormWrapper>
);
