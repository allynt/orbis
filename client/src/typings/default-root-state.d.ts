import { DataState } from 'data-layers/data-layers.slice'; // eslint-disable-line
import { DrawingToolsState } from 'drawing-tools/types'; // eslint-disable-line
import { OrbState } from 'map/orbs/orbReducer'; // eslint-disable-line
import { SatellitesState } from 'satellites/satellites.slice'; // eslint-disable-line

declare module 'react-redux' {
  export interface DefaultRootState {
    data: DataState;
    orbs: OrbState;
    drawingTools: DrawingToolsState;
    satellites: SatellitesState;
  }
}
