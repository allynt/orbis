import {
  CircleIcon,
  DrawPolygonIcon,
  FreehandIcon,
  MapPinIcon,
} from '@astrosat/astrosat-ui';

import { Edit } from '@material-ui/icons';
import {
  DrawCircleFromCenterMode,
  DrawLineStringMode,
  DrawPointMode,
  DrawPolygonMode,
  ModifyMode,
  ViewMode,
} from '@nebula.gl/edit-modes';

export const DRAW_MODE_MAP = {
  DrawPointMode,
  DrawCircleFromCenterMode,
  DrawLineStringMode,
  DrawPolygonMode,
  ModifyMode,
  ViewMode,
};

export const TOOLS = [
  {
    text: 'Line String',
    Icon: FreehandIcon,
    value: 'DrawLineStringMode',
  },
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
    text: 'Edit',
    Icon: Edit,
    value: 'ModifyMode',
  },
];
