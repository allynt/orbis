import React from 'react';

import style from './map-style-switcher.module.css';
import { toTitleCase } from 'utils/text';

/**
 * @param {{
 *   mapStyles: import('map-style/styles').MapStyles
 *   selectedMapStyle?: import('map-style/styles').MapStyleKey
 *   selectMapStyle?: (newStyle: import('map-style/styles').MapStyleKey) => void
 * }} props
 */
const MapStyleSwitcher = ({ mapStyles, selectedMapStyle, selectMapStyle }) => (
  <ul className={style['mapstyle-switcher-container']}>
    {Object.entries(mapStyles).map(([styleKey, { img, webp }]) => (
      <li
        key={styleKey}
        className={`${style.item} ${
          styleKey === selectedMapStyle ? style.checked : ''
        }`}
      >
        <label className={style.label}>
          <input
            className={style.input}
            name="mapStyle"
            type="radio"
            tabIndex={0}
            onChange={() => selectMapStyle(styleKey)}
            onKeyUp={() => selectMapStyle(styleKey)}
            value={styleKey}
            checked={styleKey === selectedMapStyle}
          />
          <picture>
            <source srcSet={webp} type="image/webp" />
            <img className={style.picture} src={img} alt="Preview" />
          </picture>
          <span className={style.text}>{toTitleCase(styleKey)}</span>
        </label>
      </li>
    ))}
  </ul>
);

export default MapStyleSwitcher;
