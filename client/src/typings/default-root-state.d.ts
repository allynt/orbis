import { DrawingToolsState } from 'drawing-tools/types'; // eslint-disable-line
import { OrbState } from 'map/orbs/orbReducer'; // eslint-disable-line
import { SatellitesState } from 'satellites/satellites.slice'; // eslint-disable-line

declare module 'react-redux' {
  export interface DefaultRootState {
    orbs: OrbState;
    drawingTools: DrawingToolsState;
    satellites: SatellitesState;
  }
}
