import React from 'react';

import {
  ImageList,
  ImageListItem,
  styled,
  useMediaQuery,
  useTheme,
} from '@astrosat/astrosat-ui';

import { OrbCard } from './orb-card.component';
import { Wrapper } from './wrapper.component';

const Heading = styled('h1')(({ theme }) => ({
  ...theme.typography.h1,
  fontWeight: 600,
  fontSize: '2rem',
  width: 'fit-content',
  margin: theme.spacing(0, 'auto', 5),
  borderBottom: `1px solid ${theme.palette.primary.main}`,
}));

/**
 * @param {{
 *  orbs: import('typings').Orb[]
 * }} props
 */
export const Orbs = ({ orbs = [] }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const xsDown = useMediaQuery(theme.breakpoints.down('xs'));

  let cols = 3;
  if (smDown) cols = 2;
  if (xsDown) cols = 1;

  return (
    <Wrapper maxWidth={false}>
      <Heading>Orbis Store</Heading>
      <ImageList cols={cols} gap={16} rowHeight="auto">
        {orbs.map(orb => (
          <ImageListItem key={orb.id}>
            <OrbCard orb={orb} />
          </ImageListItem>
        ))}
      </ImageList>
    </Wrapper>
  );
};
