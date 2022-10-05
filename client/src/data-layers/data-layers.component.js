import React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

import DataLayersToolbar from './data-layers-toolbar.component';

const useStyles = makeStyles(theme => ({
  disablingElement: {
    transition: theme.transitions.create(['filter', 'opacity']),
    '&$disabled': {
      filter: 'grayscale(100%)',
      opacity: 0.8,
      cursor: 'not-allowed',
    },
  },
  disabled: {},
}));

/**
 * @param {{
 *   sidebarComponents: Record<string, JSX.Element | JSX.Element[]>
 *   drawingToolsEnabled?: import('drawing-tools/types').DrawingToolsProps['drawingToolsEnabled']
 * }} props
 */
const DataLayers = ({
  sidebarComponents,
  drawingToolsEnabled,
  aoiDrawMode,
  setAoiDrawMode,
}) => {
  const styles = useStyles();

  return (
    <div
      className={clsx(styles.disablingElement, {
        [styles.disabled]: drawingToolsEnabled,
      })}
    >
      <DataLayersToolbar
        sidebarComponents={sidebarComponents}
        drawingToolsEnabled={drawingToolsEnabled}
        aoiDrawMode={aoiDrawMode}
        setAoiDrawMode={setAoiDrawMode}
      />
    </div>
  );
};

DataLayers.propTypes = {};

export default DataLayers;
