import React from 'react';

import {
  AnnotationsIcon,
  EyeIcon,
  makeStyles,
  MapPinIcon,
  Tooltip,
} from '@astrosat/astrosat-ui';

import * as EditModes from '@nebula.gl/edit-modes';

import { ImageList, ImageListItem, MapControlButton } from 'components';

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
 *  open?: boolean
 *  onButtonClick: (event: React.MouseEventHandler<HTMLButtonElement>) => void
 *  onToolSelect?: (toolName: keyof EditModes) => void
 *  selectedTool?: keyof EditModes
 *  className?: string
 * }} props
 */
export const DrawingToolsToolbox = ({
  open = false,
  onButtonClick,
  onToolSelect,
  selectedTool,
  className,
}) => {
  const styles = useStyles();

  /** @param {keyof EditModes} tool */
  const handleToolChange = tool => {
    if (onToolSelect == null) return;
    if (tool === selectedTool) return onToolSelect(EditModes.ViewMode.name);
    onToolSelect(tool);
  };

  return (
    <Tooltip
      classes={{ tooltip: styles.tooltip, arrow: styles.arrow }}
      open={open}
      interactive
      placement="left"
      arrow
      title={
        <ImageList
          name="drawing-tools"
          onChange={handleToolChange}
          value={selectedTool}
        >
          <ImageListItem
            text="Point"
            icon={<MapPinIcon color="primary" />}
            value={EditModes.DrawPointMode.name}
          />
        </ImageList>
      }
    >
      <MapControlButton className={className} onClick={onButtonClick}>
        <AnnotationsIcon titleAccess="Drawing Tools" fontSize="inherit" />
      </MapControlButton>
    </Tooltip>
  );
};
