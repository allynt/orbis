import { DrawPolygonIcon, MapPinIcon, RulerIcon } from '@astrosat/astrosat-ui';
import { Edit, Transform } from '@material-ui/icons';
import {
  DrawPointMode,
  DrawPolygonMode,
  MeasureDistanceMode,
  ModifyMode,
  TransformMode,
  ViewMode,
} from '@nebula.gl/edit-modes';

export const DRAW_MODE_MAP = {
  DrawPointMode,
  DrawPolygonMode,
  MeasureDistanceMode,
  ModifyMode,
  TransformMode,
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
