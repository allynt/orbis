import React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import { Popup as ReactMapGlPopup } from 'react-map-gl';

const useStyles = makeStyles(theme => ({
  popup: {
    '& .mapboxgl-popup-content': {
      background: theme.palette.background.default,
      borderRadius: '1rem',
    },
    '& .mapboxgl-popup-close-button': {
      borderRadius: '50%',
      cursor: 'pointer',
      width: '2rem',
      height: '2rem',
      color: theme.palette.text.primary,
      fontSize: 'x-large',
      '&:active, &:hover': {
        backgroundColor: theme.palette.secondary.light,
      },
    },
    [`&.mapboxgl-popup-anchor-top-left,
      &.mapboxgl-popup-anchor-top,
      &.mapboxgl-popup-anchor-top-right`]: {
      '& .mapboxgl-popup-tip': {
        borderBottomColor: theme.palette.background.default,
      },
    },
    [`&.mapboxgl-popup-anchor-bottom-left,
    &.mapboxgl-popup-anchor-bottom,
    &.mapboxgl-popup-anchor-bottom-right`]: {
      '& .mapboxgl-popup-tip': {
        borderTopColor: theme.palette.background.default,
      },
    },
    '&.mapboxgl-popup-anchor-right .mapboxgl-popup-tip': {
      borderLeftColor: theme.palette.background.default,
    },
    '&.mapboxgl-popup-anchor-left .mapboxgl-popup-tip': {
      borderRightColor: theme.palette.background.default,
    },
    '&.mapboxgl-popup-anchor-top': {
      '&-left .mapboxgl-popup-content': {
        borderTopLeftRadius: 0,
      },
      '&-right .mapboxgl-popup-content': {
        borderTopRightRadius: 0,
      },
    },
    '&.mapboxgl-popup-anchor-bottom': {
      '&-right .mapboxgl-popup-content': {
        borderBottomRightRadius: 0,
      },
      '&-left .mapboxgl-popup-content': {
        borderBottomLeftRadius: 0,
      },
    },
  },
}));

/**
 * @param {Omit<import('react-map-gl').PopupProps, "className">} props
 */
export const Popup = ({ dynamicPosition = false, ...rest }) => {
  const styles = useStyles();
  return (
    <ReactMapGlPopup
      className={styles.popup}
      dynamicPosition={dynamicPosition}
      closeOnClick={false}
      captureClick
      {...rest}
    />
  );
};
