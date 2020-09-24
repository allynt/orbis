import React from 'react';

import style from './map-style-switcher.module.css';
import { toTitleCase } from 'utils/text';

/**
 * @param {{
 *   mapStyles: import('map-style/styles').MapStyle
 *   selectedMapStyle: import('map-style/styles').MapStyleKey
 *   selectMapStyle: (newStyle: import('map-style/styles').MapStyleKey) => void
 * }} props
 */
const MapStyleSwitcher = ({ mapStyles, selectedMapStyle, selectMapStyle }) => (
  <ul className={style['mapstyle-switcher-container']}>
    {Object.entries(mapStyles).map(([styleKey, { img, webp }]) => (
      <li key={styleKey}>
        <label className={styleKey === selectedMapStyle ? style.checked : ''}>
          <input
            name="mapStyle"
            type="radio"
            onChange={() => selectMapStyle(styleKey)}
            value={styleKey}
            checked={styleKey === selectedMapStyle}
          />
          <picture>
            <source srcSet={webp} type="image/webp" />
            <img src={img} alt="Preview" />
          </picture>
          <span>{toTitleCase(styleKey)}</span>
        </label>
      </li>
    ))}
  </ul>
);

export default MapStyleSwitcher;
