import {
  CircleIcon,
  DragPoygonIcon,
  DrawEllipseIcon,
  DrawPolygonIcon,
  DrawRectangleIcon,
  MapPinIcon,
  MeasureAreaIcon,
  RulerIcon,
} from '@astrosat/astrosat-ui';
import { Edit, Transform } from '@material-ui/icons';
import {
  DrawCircleFromCenterMode,
  DrawPointMode,
  DrawPolygonMode,
  DrawPolygonByDraggingMode,
  DrawRectangleMode,
  DrawEllipseByBoundingBoxMode,
  MeasureAreaMode,
  MeasureDistanceMode,
  ModifyMode,
  ScaleMode,
  TranslateMode,
  CompositeMode,
  ViewMode,
} from '@nebula.gl/edit-modes';

export const DRAW_MODE_MAP = {
  DrawCircleFromCenterMode,
  DrawPointMode,
  DrawPolygonMode,
  DrawPolygonByDraggingMode,
  DrawRectangleMode,
  DrawEllipseByBoundingBoxMode,
  MeasureAreaMode,
  MeasureDistanceMode,
  ModifyMode,
  TransformMode: new CompositeMode([new TranslateMode(), new ScaleMode()]),
  ViewMode,
};

/**
 * @typedef {keyof DRAW_MODE_MAP} EditMode
 */

/** @type {EditMode[]} */
export const SELECTABLE_MODES = ['TransformMode', 'ModifyMode'];

/**
 * @type {{
 *  text: string,
 *  Icon(props: import('@material-ui/core').SvgIconProps): JSX.Element,
 *  value: EditMode
 * }[]}
 */
export const TOOLS = [
  {
    text: 'Point',
    Icon: MapPinIcon,
    value: 'DrawPointMode',
  },
  {
    text: 'Circle',
    Icon: CircleIcon,
    value: 'DrawCircleFromCenterMode',
  },
  {
    text: 'Polygon',
    Icon: DrawPolygonIcon,
    value: 'DrawPolygonMode',
  },
  {
    text: 'Drag Polygon',
    Icon: DragPoygonIcon,
    value: 'DrawPolygonByDraggingMode',
  },
  {
    text: 'Rectangle',
    Icon: DrawRectangleIcon,
    value: 'DrawRectangleMode',
  },
  {
    text: 'Ellipse',
    Icon: DrawEllipseIcon,
    value: 'DrawEllipseByBoundingBoxMode',
  },
  {
    text: 'Measure Area',
    Icon: MeasureAreaIcon,
    value: 'MeasureAreaMode',
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

export const FEATURE_COLORS = [
  '#00AEE4',
  '#DAF0E3',
  '#9BCC32',
  '#07A35A',
  '#F7DF90',
  '#EA376C',
  '#6A126A',
  '#FCB09B',
  '#B0592D',
  '#C1B5E3',
  '#9C805B',
  '#CCDFE5',
];
