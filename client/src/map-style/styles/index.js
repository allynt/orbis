import darkImg from './dark.png';
import darkWebP from './dark.webp';
import lightImg from './light.png';
import lightWebP from './light.webp';
import { default as dark } from './orbis-dark.json';
import { default as light } from './orbis-light.json';
import { default as os } from './orbis-os.json';
import { default as satellite } from './orbis-satellite-streets.json';
import { default as streets } from './orbis-streets.json';
import satelliteImg from './satellite.png';
import satelliteWebP from './satellite.webp';
import streetsImg from './streets.png';
import streetsWebP from './streets.webp';

/**
 * @typedef {'satellite' | 'light' | 'dark' | 'streets'} MapStyleKey
 */

/**
 * @typedef {{
 *   style: (Object & import('mapbox-gl').Style)
 *   img: any
 *   webp: any
 * }} MapStyle
 */

/**
 * @typedef {Record<MapStyleKey, MapStyle>} MapStyles
 */

/** @type {MapStyles} */
export const styles = {
  satellite: {
    style: satellite,
    img: satelliteImg,
    webp: satelliteWebP,
  },
  light: {
    style: light,
    img: lightImg,
    webp: lightWebP,
  },
  dark: {
    style: dark,
    img: darkImg,
    webp: darkWebP,
  },
  streets: {
    style: streets,
    img: streetsImg,
    webp: streetsWebP,
  },
  os: {
    style: os,
    img: streetsImg,
    webp: streetsWebP,
  },
};
