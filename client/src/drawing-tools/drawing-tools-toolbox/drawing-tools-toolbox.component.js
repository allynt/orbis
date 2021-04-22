import React from 'react';

import { AnnotationsIcon, makeStyles, Tooltip } from '@astrosat/astrosat-ui';

import { ImageList, ImageListItem, MapControlButton } from 'components';
import { TOOLS } from 'drawing-tools/drawing-tools.config';

const useStyles = makeStyles(theme => ({
  tooltip: {
    padding: 0,
    maxWidth: theme.typography.pxToRem(128 * 3),
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
 *  onToolSelect?: (toolName: import('drawing-tools/types').EditMode) => void
 *  selectedTool?: import('drawing-tools/types').EditMode
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

  /** @param {import('drawing-tools/types').EditMode} tool */
  const handleToolChange = tool => {
    if (onToolSelect == null) return;
    if (tool === selectedTool) return onToolSelect('ViewMode');
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
          {TOOLS.map(({ text, Icon, value }) => (
            <ImageListItem
              key={value}
              text={text}
              icon={<Icon color="primary" />}
              value={value}
            />
          ))}
        </ImageList>
      }
    >
      <MapControlButton
        className={className}
        onClick={onButtonClick}
        selected={open}
      >
        <AnnotationsIcon titleAccess="Drawing Tools" fontSize="inherit" />
      </MapControlButton>
    </Tooltip>
  );
};
