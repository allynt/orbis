import {
  CircleIcon,
  DragPoygonIcon,
  DrawPolygonIcon,
  DrawRectangleIcon,
  MapPinIcon,
} from '@astrosat/astrosat-ui';

import { Edit } from '@material-ui/icons';
import {
  DrawCircleFromCenterMode,
  DrawPointMode,
  DrawPolygonMode,
  DrawPolygonByDraggingMode,
  DrawRectangleMode,
  ModifyMode,
  ViewMode,
} from '@nebula.gl/edit-modes';

export const DRAW_MODE_MAP = {
  DrawPointMode,
  DrawCircleFromCenterMode,
  DrawPolygonMode,
  DrawPolygonByDraggingMode,
  DrawRectangleMode,
  ModifyMode,
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
  },
  {
    text: 'Edit',
    Icon: Edit,
    value: 'ModifyMode',
  },
];
