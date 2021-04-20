import React from 'react';

import {
  AnnotationsIcon,
  DrawPolygonIcon,
  makeStyles,
  MapPinIcon,
  RulerIcon,
  Tooltip,
} from '@astrosat/astrosat-ui';

import { Edit, Transform } from '@material-ui/icons';

import { ImageList, ImageListItem, MapControlButton } from 'components';

/**
 * @type {{
 *  text: string,
 *  Icon(props: import('@material-ui/core').SvgIconProps): JSX.Element,
 *  value: import('drawing-tools/types').EditMode}[]}
 */
const TOOLS = [
  {
    text: 'Point',
    Icon: MapPinIcon,
    value: 'DrawPointMode',
  },
  {
    text: 'Polygon',
    Icon: DrawPolygonIcon,
    value: 'DrawPolygonMode',
  },
  {
    text: 'Measure Distance',
    Icon: RulerIcon,
    value: 'MeasureDistanceMode',
  },
  {
    text: 'Transform',
    Icon: Transform,
    value: 'TransformMode',
  },
  {
    text: 'Edit',
    Icon: Edit,
    value: 'ModifyMode',
  },
];

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
