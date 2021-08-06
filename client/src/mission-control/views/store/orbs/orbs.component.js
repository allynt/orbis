import React from 'react';

import {
  ImageList,
  ImageListItem,
  styled,
  useMediaQuery,
  useTheme,
} from '@astrosat/astrosat-ui';

import { OrbCard, OrbCardSkeleton } from './orb-card.component';
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
 *  orbs?: import('typings').Orb[]
 *  isLoading?: boolean
 * }} props
 */
export const Orbs = ({ orbs = [], isLoading = false }) => {
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
        {!isLoading
          ? orbs.map(orb => (
              <ImageListItem key={orb.id}>
                <OrbCard orb={orb} />
              </ImageListItem>
            ))
          : Array(3)
              .fill()
              .map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <ImageListItem key={i}>
                  <OrbCardSkeleton />
                </ImageListItem>
              ))}
      </ImageList>
    </Wrapper>
  );
};
