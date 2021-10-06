import React from 'react';

import { Typography, styled } from '@astrosat/astrosat-ui';

import { ReactComponent as CsvIcon } from './csv.svg';
import { ReactComponent as MapIcon } from './map.svg';

const Wrapper = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2, '25%'),
  maxWidth: '31.25rem',
  textAlign: 'center',
  [theme.breakpoints.down('xs')]: {
    gap: theme.spacing(2),
  },
  '& svg': {
    padding: theme.spacing(2),
  },
  '& .MuiTypography-root': {
    gridColumn: '1/-1',
  },
}));

export const Intro = () => (
  <Wrapper>
    <CsvIcon />
    <MapIcon />
    <Typography>
      Here you can upload a file with exact locations in it. It will be
      displayed as individual pins on the map and will be saved as a data layer,
      available only for you.
    </Typography>
    <Typography>
      The supported file format for your upload is a .csv with at least 2
      columns named Latitude and Longitude. Longitude ranges between -180 and
      180 degrees, inclusive. Latitude ranges between -90 and 90 degrees,
      inclusive.
    </Typography>
  </Wrapper>
);
