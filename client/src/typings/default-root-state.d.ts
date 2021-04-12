import { DrawingToolsState } from 'drawing-tools/types'; // eslint-disable-line
import { OrbState } from 'map/orbs/orbReducer'; // eslint-disable-line

declare module 'react-redux' {
  export interface DefaultRootState {
    orbs: OrbState;
    drawingTools: DrawingToolsState;
  }
}
