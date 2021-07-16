import React from 'react';

import { satellites, scenes } from 'satellites/satellites-test-fixtures';

import {
  SatelliteInfoTable,
  SceneInfoTable,
} from './satellites-info-tables.component';

export default { title: 'Satellites/SatellitesInfoTables' };

export const Satellite = () => <SatelliteInfoTable satellite={satellites[0]} />;

export const Scene = () => <SceneInfoTable scene={scenes[0]} />;
