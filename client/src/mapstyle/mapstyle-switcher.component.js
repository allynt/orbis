import React from 'react';
import PropTypes from 'prop-types';

import dark from './dark.png';
import darkWebP from './dark.webp';
import light from './light.png';
import lightWebP from './light.webp';
import streets from './streets.png';
import streetsWebP from './streets.webp';
import satellite from './satellite.png';
import satelliteWebP from './satellite.webp';

import style from './mapstyle-switcher.module.css';

const MapStyleSwitcher = ({ mapStyles, selectedMapStyle, selectMapStyle }) => (
  <ul className={style['mapstyle-switcher-container']}>
    {mapStyles.map((mapStyle, index) => (
      <li key={index}>
        <label className={mapStyle.id === selectedMapStyle.id ? style.checked : undefined}>
          <input
            name="mapStyle"
            type="radio"
            onChange={() => selectMapStyle(mapStyle)}
            value={mapStyle.uri}
            checked={mapStyle.id === selectedMapStyle.id}
          />
          {mapStyle.id === 'dark' && (
            <picture>
              <source srcSet={darkWebP} type="image/webp" />
              <img src={dark} alt="Preview" />
            </picture>
          )}
          {mapStyle.id === 'light' && (
            <picture>
              <source srcSet={lightWebP} type="image/webp" />
              <img src={light} alt="Preview" />
            </picture>
          )}
          {mapStyle.id === 'streets' && (
            <picture>
              <source srcSet={streetsWebP} type="image/webp" />
              <img src={streets} alt="Preview" />
            </picture>
          )}
          {mapStyle.id === 'satellite' && (
            <picture>
              <source srcSet={satelliteWebP} type="image/webp" />
              <img src={satellite} alt="Preview" />
            </picture>
          )}
          <span>{mapStyle.title}</span>
        </label>
      </li>
    ))}
  </ul>
);

MapStyleSwitcher.propTypes = {
  mapStyles: PropTypes.array.isRequired,
  selectedMapStyle: PropTypes.object.isRequired,
  selectMapStyle: PropTypes.func.isRequired
};

export default MapStyleSwitcher;
