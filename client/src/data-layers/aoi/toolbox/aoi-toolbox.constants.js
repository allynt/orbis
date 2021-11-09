import {
  CircleIcon,
  DragPoygonIcon,
  DrawPolygonIcon,
  DrawRectangleIcon,
  MapPinIcon,
} from '@astrosat/astrosat-ui';

import { Edit, Transform } from '@material-ui/icons';
import {
  DrawCircleFromCenterMode,
  DrawPointMode,
  DrawPolygonMode,
  DrawPolygonByDraggingMode,
  DrawRectangleMode,
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
  ModifyMode,
  TransformMode: new CompositeMode([new TranslateMode(), new ScaleMode()]),
  ViewMode,
};

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
  // },
  // {
  //   text: 'Transform',
  //   Icon: Transform,
  //   value: 'TransformMode',
  },
  {
    text: 'Edit',
    Icon: Edit,
    value: 'ModifyMode',
  },
];
