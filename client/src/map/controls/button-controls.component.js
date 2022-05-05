import React from 'react';

import { ButtonGroup, makeStyles } from '@astrosat/astrosat-ui';

import { FlyToInterpolator } from '@deck.gl/core';
import { useSelector, useDispatch } from 'react-redux';

import { MapControlButton } from 'components';
import { DrawingToolsToolbox } from 'drawing-tools';
import MapStyleSwitcher from 'map-style/map-style-switcher/map-style-switcher.component';
import { mapStylesSelector, selectMapStyle } from 'map/map.slice';
import {
  extrudedModeSelector,
  toggleExtrudedMode,
} from 'map/orbs/layers.slice';

const useStyles = makeStyles({
  buttonControls: { position: 'absolute', right: '2rem', bottom: '8rem' },
});

const ISOMETRIC_PITCH = 35;

export const ButtonControls = React.memo(
  /**
   */
  ({
    drawingToolsEnabled,
    setDrawingToolsEnabled,
    setDrawMode,
    drawMode,
    updateViewState,
    selectedMapStyleId,
  }) => {
    const styles = useStyles();
    const extrudedMode = useSelector(state =>
      extrudedModeSelector(state?.orbs),
    );
    const mapStyles = useSelector(mapStylesSelector);
    const dispatch = useDispatch();

    const handleExtrudedModeButtonClick = () => {
      updateViewState({
        pitch: !extrudedMode ? ISOMETRIC_PITCH : 0,
        transitionDuration: 750,
        transitionInterpolator: new FlyToInterpolator(),
      });
      dispatch(toggleExtrudedMode());
    };

    const handleMapStyleSelect = mapStyle => dispatch(selectMapStyle(mapStyle));

    return (
      <ButtonGroup className={styles.buttonControls} orientation="vertical">
        <DrawingToolsToolbox
          open={drawingToolsEnabled}
          onButtonClick={() => setDrawingToolsEnabled(!drawingToolsEnabled)}
          onToolSelect={tool => setDrawMode(tool)}
          selectedTool={drawMode}
        />
        <MapControlButton
          selected={extrudedMode}
          aria-selected={extrudedMode}
          onClick={handleExtrudedModeButtonClick}
        >
          3D
        </MapControlButton>
        <MapStyleSwitcher
          mapStyles={mapStyles}
          selectedMapStyle={selectedMapStyleId}
          selectMapStyle={handleMapStyleSelect}
        />
      </ButtonGroup>
    );
  },
);
ButtonControls.displayName = 'ButtonControls';
