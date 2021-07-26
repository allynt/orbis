/* eslint-disable import/named */
// eslint-disable-next-line import/no-unresolved
import { DrawingToolsState } from 'drawing-tools/types';

import { AccountsState } from 'accounts/accounts.slice';
import { DataState } from 'data-layers/data-layers.slice';
import { OrbState } from 'map/orbs/orbReducer';
import { SatellitesState } from 'satellites/satellites.slice';

declare module 'react-redux' {
  export interface DefaultRootState {
    accounts: AccountsState;
    data: DataState;
    orbs: OrbState;
    drawingTools: DrawingToolsState;
    satellites: SatellitesState;
  }
}
