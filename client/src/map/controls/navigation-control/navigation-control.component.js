import { styled } from '@astrosat/astrosat-ui';

import { NavigationControl as ReactMapGlNavigationControl } from 'react-map-gl';

import compass from './compass.svg';
import minus from './minus.svg';
import plus from './plus.svg';

export const NavigationControl = styled(ReactMapGlNavigationControl)(
  ({ theme }) => ({
    position: 'absolute',
    right: '2rem',
    zIndex: 1,
    bottom: '2rem',
    backgroundColor: 'transparent',
    '& > button': {
      backgroundColor: theme.palette.background.default,
      transition: theme.transitions.create('opacity', {
        duration: theme.transitions.duration.short,
      }),
      '& + button': {
        borderColor: theme.palette.primary.main,
      },
      '&:first-of-type': {
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        '& > span': {
          backgroundImage: `url(${plus}) !important`,
          backgroundSize: '100%',
        },
      },
      '&:not(:first-of-type):not(:last-of-type) > span': {
        backgroundImage: `url(${minus}) !important`,
        backgroundSize: '100%',
      },
      '&:last-of-type': {
        borderBottomLeftRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
        '& > span': {
          backgroundImage: `url(${compass}) !important`,
        },
      },
      '&:not(:disabled):hover': {
        backgroundColor: theme.palette.background.default,
        opacity: `0.5 !important`,
      },
    },
  }),
);
