import React from 'react';

import { Dialog, DialogTitle, DialogContent } from '@astrosat/astrosat-ui';

import { InfoType } from 'satellites/satellite.constants';

import {
  SatelliteInfoTable,
  SceneInfoTable,
} from './satellites-info-tables/satellites-info-tables.component';

/**
 * @param {{
 *  type: string
 *  data: any
 *  open: boolean
 *  onClose: () => void
 * }} props
 */
export const MoreInfoDialog = ({ type, data, open, onClose }) => {
  return (
    <Dialog open={open && !!type} onClose={onClose}>
      <DialogTitle>More Information</DialogTitle>
      <DialogContent>
        {type === InfoType.SATELLITE && <SatelliteInfoTable satellite={data} />}
        {type === InfoType.SCENE && <SceneInfoTable scene={data} />}
      </DialogContent>
    </Dialog>
  );
};
