import React, { useState } from 'react';

import { LayersIcon, Tooltip, makeStyles } from '@astrosat/astrosat-ui';

import { MapControlButton, ImageList, ImageListItem } from 'components';

/**
 * @param {{
 *   mapStyles: import('map-style/styles').MapStyles
 *   selectedMapStyle?: import('map-style/styles').MapStyleKey
 *   onInputChange?: (newStyle: import('map-style/styles').MapStyleKey) => void
 * }} props
 */
export const StyleSwitcherContent = ({
  onInputChange,
  selectedMapStyle,
  mapStyles,
}) => (
  <ImageList name="mapStyle" onChange={onInputChange} value={selectedMapStyle}>
    {Object.entries(mapStyles).map(([styleKey, { name, thumbnail }]) => (
      <ImageListItem
        key={styleKey}
        value={styleKey}
        text={name}
        src={`${window?._env_?.REACT_APP_API_HOST}${thumbnail}`}
        alt={name}
      />
    ))}
  </ImageList>
);

const useStyles = makeStyles(theme => ({
  tooltip: {
    padding: 0,
    maxWidth: '100%',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
  arrow: {
    color: theme.palette.background.default,
  },
}));

/**
 * @param {{
 *   defaultOpen?: boolean
 *   mapStyles: import('map-style/styles').MapStyles
 *   selectedMapStyle?: import('map-style/styles').MapStyleKey
 *   selectMapStyle?: (newStyle: import('map-style/styles').MapStyleKey) => void
 *   className?: string
 * }} props
 */
const MapStyleSwitcher = ({
  defaultOpen = false,
  mapStyles = {},
  selectedMapStyle,
  selectMapStyle,
  className,
}) => {
  const styles = useStyles();
  const [open, setOpen] = useState(defaultOpen);

  const handleInputChange = styleKey => selectMapStyle(styleKey);

  return (
    <Tooltip
      classes={{ tooltip: styles.tooltip, arrow: styles.arrow }}
      open={open}
      arrow
      placement="left"
      interactive
      onClose={() => setOpen(false)}
      title={
        <StyleSwitcherContent
          onInputChange={handleInputChange}
          mapStyles={mapStyles}
          selectedMapStyle={selectedMapStyle}
        />
      }
    >
      <MapControlButton
        className={className}
        onClick={() => setOpen(!open)}
        selected={open}
      >
        <LayersIcon fontSize="inherit" titleAccess="Change map style" />
      </MapControlButton>
    </Tooltip>
  );
};

export default MapStyleSwitcher;
