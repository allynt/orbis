import React from 'react';

import { Typography, styled, Button } from '@astrosat/astrosat-ui';

import { Dots } from '../dots.component';
import { ReactComponent as CsvIcon } from './csv.svg';
import { ReactComponent as MapIcon } from './map.svg';

const Wrapper = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2, '25%'),
  justifyItems: 'center',
  textAlign: 'center',
  [theme.breakpoints.down('xs')]: {
    gap: theme.spacing(2),
  },
  '& svg': {
    padding: theme.spacing(2),
  },
  '& .MuiTypography-root, & .MuiButton-root, & .dots': {
    gridColumn: '1/-1',
  },
  '& .MuiButton-root': {
    width: 'fit-content',
  },
}));

/**
 * @param {{
 *  onNextClick: React.MouseEventHandler<HTMLButtonElement>
 * }} props
 */
const Intro = ({ onNextClick }) => (
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
    <Dots className="dots" />
    <Button onClick={onNextClick}>Next</Button>
  </Wrapper>
);

export { Intro };
