import React from 'react';

import {
  ImageList,
  ImageListItem,
  useMediaQuery,
  useTheme,
} from '@astrosat/astrosat-ui';

import { Heading } from '../../../shared-components/heading.component';
import { Wrapper } from '../../../shared-components/wrapper.component';
import { OrbCard, OrbCardSkeleton } from './orb-card.component';

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
