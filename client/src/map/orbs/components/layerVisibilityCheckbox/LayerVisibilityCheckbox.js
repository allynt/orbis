import React from 'react';

import { Checkbox, FormControlLabel, makeStyles } from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import { layersVisibilitySelector, setVisibility } from '../../orbReducer.js';

const useStyles = makeStyles(theme => ({
  label: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    borderRadius: '50%',
    backgroundColor: props => props.pinColor,
    height: '1rem',
    width: '1rem',
    margin: theme.spacing(0, 1),
  },
}));

/**
 *  @param {{
 *   selectedLayer?: import('typings/orbis').Source
 *   dispatch?: import('redux').Dispatch
 * }} props
 */
export const LayerVisibilityCheckbox = ({ selectedLayer, dispatch }) => {
  const pinColor =
    selectedLayer?.metadata?.application?.orbis?.layer?.props?.pinColor ||
    'hotpink';

  const classes = useStyles({ pinColor });

  const isVisible = useSelector(state =>
    layersVisibilitySelector(selectedLayer?.source_id)(state?.orbs),
  );

  /**
   * @param {string} value
   */
  const handleChange = () =>
    dispatch(
      setVisibility({
        source_id: selectedLayer?.source_id,
        visible: !isVisible,
      }),
    );

  return (
    <FormControlLabel
      classes={{ label: classes.label }}
      label={
        <>
          <div className={classes.icon} /> {selectedLayer.metadata.label}
        </>
      }
      control={
        <Checkbox
          tabIndex={-1}
          checked={isVisible}
          inputProps={{ 'aria-labelledby': selectedLayer.metadata.label }}
          onChange={handleChange}
        />
      }
    />
  );
};
