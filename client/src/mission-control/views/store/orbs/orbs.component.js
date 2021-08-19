import React from 'react';

import {
  ImageList,
  ImageListItem,
  useMediaQuery,
  useTheme,
} from '@astrosat/astrosat-ui';

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

  const max = {
    x: (orbs.length - 1) % cols,
    y: Math.floor((orbs.length - 1) / cols),
  };

  return (
    <Wrapper title="Orbis Store">
      <ImageList cols={cols} gap={8} rowHeight="auto">
        {!isLoading
          ? orbs.map((orb, index) => {
              const coords = { x: index % cols, y: Math.floor(index / cols) };
              return (
                <ImageListItem key={orb.id}>
                  {/* <pre>{JSON.stringify(coords, null, 2)}</pre>
                  <pre>
                    {JSON.stringify(
                      Object.entries({
                        '↖️': index === 0,
                        '↗️':
                          coords.y === 0 &&
                          (max.y === 0
                            ? coords.x === max.x
                            : index + 1 === cols),
                        '↘️':
                          (coords.x === max.x && coords.y === max.y) ||
                          (orbs.length % cols !== 0 &&
                            coords.y === max.y - 1 &&
                            coords.x + 1 === cols),
                        '↙️': coords.x === 0 && coords.y === max.y,
                      })
                        .map(([key, value]) => (value ? key : false))
                        .filter(value => !!value),
                    )}
                  </pre> */}
                  <OrbCard
                    orb={orb}
                    style={{
                      borderTopLeftRadius: index === 0 ? 10 : 0,
                      borderTopRightRadius:
                        coords.y === 0 &&
                        (max.y === 0 ? coords.x === max.x : index + 1 === cols)
                          ? 10
                          : 0,
                      borderBottomRightRadius:
                        (coords.x === max.x && coords.y === max.y) ||
                        (orbs.length % cols !== 0 &&
                          coords.y === max.y - 1 &&
                          coords.x + 1 === cols)
                          ? 10
                          : 0,
                      borderBottomLeftRadius:
                        coords.x === 0 && coords.y === max.y ? 10 : 0,
                    }}
                  />
                </ImageListItem>
              );
            })
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
