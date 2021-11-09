import React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { useSelector } from 'react-redux';

import DataLayersToolbar from './data-layers-toolbar.component';
import { activeCategorisedSourcesSelector } from './data-layers.slice';

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
const DataLayers = ({ sidebarComponents, drawingToolsEnabled }) => {
  const styles = useStyles();

  const activeCategorisedSources = useSelector(
    activeCategorisedSourcesSelector(1, true),
  );

  return (
    <div
      className={clsx(styles.disablingElement, {
        [styles.disabled]: drawingToolsEnabled,
      })}
    >
      <DataLayersToolbar
        sidebarComponents={sidebarComponents}
        activeCategorisedSources={activeCategorisedSources}
        drawingToolsEnabled={drawingToolsEnabled}
      />
    </div>
  );
};

DataLayers.propTypes = {};

export default DataLayers;
