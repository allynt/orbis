import React from 'react';

import {
  ImageList,
  ImageListItem,
  useMediaQuery,
  useTheme,
} from '@astrosat/astrosat-ui';

import { OrbCard } from './orb-card.component';

/**
 * @param {{
 *  orbs: import('typings').Orb[]
 * }} props
 */
export const Orbs = ({ orbs }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const xsDown = useMediaQuery(theme.breakpoints.down('xs'));

  let cols = 3;
  if (smDown) cols = 2;
  if (xsDown) cols = 1;

  return (
    <ImageList cols={cols} gap={16} rowHeight="auto">
      {orbs.map(orb => (
        <ImageListItem key={orb.id}>
          <OrbCard orb={orb} />
        </ImageListItem>
      ))}
    </ImageList>
  );
};
