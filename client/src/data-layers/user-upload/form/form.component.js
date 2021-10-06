import React from 'react';

import { TextField, Typography, Link } from '@astrosat/astrosat-ui';

import { ReactComponent as CsvIcon } from '../intro/csv.svg';

const UploadIcon = ({ Icon }) => (
  <div
    style={{
      position: 'relative',
      border: 'dashed 1px #979797',
      borderRadius: '5px',
      width: '100%',
      maxWidth: '50px',
      aspectRatio: '1.4',
      padding: '8px 7px',
      flexShrink: 0,
    }}
  >
    {React.cloneElement(Icon, {
      style: {
        maxWidth: '31px',
        position: 'absolute',
        right: -5,
        bottom: -5,
      },
    })}
  </div>
);

export const Form = () => (
  <form>
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'row',
        justifyItems: 'center',
        border: 'dashed 3px #979797',
        borderRadius: '10px',
        padding: '20px 20px 30px',
      }}
    >
      <Typography variant="h1" component="label">
        Drop the file here or <Link>Browse</Link>
      </Typography>
      <Typography>Only supported files will be processed. </Typography>
      <UploadIcon Icon={<CsvIcon />} />
    </div>
    <TextField label="Name Your Data" required />
    <TextField label="Add a Description for Your Data" />
  </form>
);
