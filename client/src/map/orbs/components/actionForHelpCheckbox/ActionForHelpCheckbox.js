import React from 'react';

import { Checkbox, FormControlLabel } from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import {
  layersVisibilitySelector,
  setVisibility,
} from '../../slices/action-for-help.slice';

/**
 *  @param {{
 *   selectedLayer?: import('typings/orbis').Source
 *   dispatch?: import('redux').Dispatch
 * }} props
 */
export const ActionForHelpCheckbox = ({ selectedLayer, dispatch }) => {
  const isVisible = useSelector(state =>
    layersVisibilitySelector(selectedLayer?.source_id)(state),
  );

  /**
   * @param {string} value
   */
  const handleChange = () =>
    dispatch(
      setVisibility({
        id: selectedLayer.source_id,
        value: !isVisible,
      }),
    );

  return (
    <FormControlLabel
      label={selectedLayer.metadata.label}
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
