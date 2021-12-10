import React from 'react';

import {
  ImageList,
  ImageListItem,
  useMediaQuery,
  useTheme,
} from '@astrosat/astrosat-ui';

import { Wrapper } from 'mission-control/shared-components/wrapper.component';

import { OrbCard, OrbCardSkeleton } from './orb-card.component';

/**
 * @param {number} index
 * @param {number} total
 * @param {number} columns
 * @param {{x: number, y: number}} max
 */
export const getBorderRadiuses = (
  index,
  total,
  columns,
  max,
  borderRadius = 10,
) => {
  const radiuses = {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  };
  const coords = { x: index % columns, y: Math.floor(index / columns) };
  //=== Top Left ====
  if (index === 0) {
    radiuses.borderTopLeftRadius = borderRadius;
  }
  //=== Top Right ====
  if (
    coords.y === 0 &&
    (max.y === 0 ? coords.x === max.x : index + 1 === columns)
  ) {
    radiuses.borderTopRightRadius = borderRadius;
  }
  //=== Bottom Right ====
  if (
    (coords.x === max.x && coords.y === max.y) ||
    (total % columns !== 0 &&
      coords.y === max.y - 1 &&
      coords.x + 1 === columns)
  ) {
    radiuses.borderBottomRightRadius = borderRadius;
  }
  //=== Bottom Left ====
  if (coords.x === 0 && coords.y === max.y) {
    radiuses.borderBottomLeftRadius = borderRadius;
  }
  return radiuses;
};

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

  const max = {
    x: (orbs.length - 1) % cols,
    y: Math.floor((orbs.length - 1) / cols),
  };

  return (
    <Wrapper title="Orbs">
      <ImageList cols={cols} gap={8} rowHeight="auto">
        {!isLoading
          ? orbs.map((orb, index) => (
              <ImageListItem key={orb.id}>
                <OrbCard
                  orb={orb}
                  style={getBorderRadiuses(index, orbs.length, cols, max)}
                />
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
