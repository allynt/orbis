import React from 'react';

import { AnnotationsIcon, Tooltip } from '@astrosat/astrosat-ui';

import * as EditModes from '@nebula.gl/edit-modes';

import { ImageList, ImageListItem, MapControlButton } from 'components';

/**
 * @param {{
 *  open?: boolean
 *  onButtonClick: (event: React.MouseEventHandler<HTMLButtonElement>) => void
 *  onToolSelect: (toolName: keyof EditModes) => void
 *  selectedTool?: keyof EditModes
 * }} props
 */
export const DrawingToolsToolbox = ({
  open = false,
  onButtonClick,
  onToolSelect,
  selectedTool,
}) => {
  /** @param {keyof EditModes} tool */
  const handleToolChange = tool => {
    if (onToolSelect == null) return;
    if (tool === selectedTool) onToolSelect(EditModes.ViewMode.name);
    onToolSelect(tool);
  };

  return (
    <Tooltip
      open={open}
      interactive
      title={
        <ImageList
          name="drawing-tools"
          onChange={handleToolChange}
          value={selectedTool}
        >
          <ImageListItem
            text="Draw Point"
            value={EditModes.DrawPointMode.name}
          />
        </ImageList>
      }
    >
      <MapControlButton onClick={onButtonClick}>
        <AnnotationsIcon titleAccess="Drawing Tools" />
      </MapControlButton>
    </Tooltip>
  );
};
