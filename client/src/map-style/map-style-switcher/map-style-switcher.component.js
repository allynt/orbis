import React from 'react';

import clsx from 'clsx';

import { Fade, makeStyles } from '@astrosat/astrosat-ui';

import { toTitleCase } from 'utils/text';

const useStyles = makeStyles(theme => ({
  container: {
    position: 'absolute',
    bottom: '7rem',
    right: '4rem',
    zIndex: 10,
    display: 'flex',
    padding: 0,
    listStyleType: 'none',
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
  },
  item: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: theme.palette.text.primary,
    cursor: 'pointer',
    padding: '0.5em 1em',
    transition: 'background-color 250ms ease, color 250ms ease',
    '&:hover, &:focus-within': {
      background: theme.palette.primary.dark,
    },
    '&:first-of-type': {
      borderTopLeftRadius: theme.shape.borderRadius,
      borderBottomLeftRadius: theme.shape.borderRadius,
    },
    '&:last-of-type': {
      borderTopRightRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
    '&$checked': {
      background: theme.palette.primary.main,
      color: theme.palette.background.default,
    },
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    cursor: 'pointer',
  },

  checked: {},
  input: {
    opacity: 0,
    position: 'absolute',
  },
  picture: {
    maxWidth: '3.75rem',
  },
}));

/**
 * @param {{
 *   open?: boolean
 *   mapStyles: import('map-style/styles').MapStyles
 *   selectedMapStyle?: import('map-style/styles').MapStyleKey
 *   selectMapStyle?: (newStyle: import('map-style/styles').MapStyleKey) => void
 * }} props
 */
const MapStyleSwitcher = ({
  open = false,
  mapStyles = {},
  selectedMapStyle,
  selectMapStyle,
}) => {
  const styles = useStyles();
  const handleInputChange = styleKey => selectMapStyle(styleKey);
  return (
    <Fade in={open}>
      <ul className={styles.container}>
        {Object.entries(mapStyles).map(([styleKey, { img, webp }]) => (
          <li
            key={styleKey}
            className={clsx(styles.item, {
              [styles.checked]: styleKey === selectedMapStyle,
            })}
          >
            <label className={styles.label}>
              <input
                className={styles.input}
                name="mapStyle"
                type="radio"
                tabIndex={0}
                onChange={() => handleInputChange(styleKey)}
                onKeyUp={() => handleInputChange(styleKey)}
                value={styleKey}
                checked={styleKey === selectedMapStyle}
              />
              <picture>
                <source srcSet={webp} type="image/webp" />
                <img className={styles.picture} src={img} alt="Preview" />
              </picture>
              <span>{toTitleCase(styleKey)}</span>
            </label>
          </li>
        ))}
      </ul>
    </Fade>
  );
};

export default MapStyleSwitcher;
