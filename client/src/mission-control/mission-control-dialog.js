import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  CloseIcon,
  Dialog,
  IconButton,
  makeStyles,
} from '@astrosat/astrosat-ui';

import {
  toggleMissionControlDialog,
  selectIsMissionControlDialogVisible,
} from 'mission-control/mission-control-slice';

import { MissionControl } from './mission-control.component';

export const MissionControlDialog = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector(selectIsMissionControlDialogVisible);

  const handleClose = () => {
    return dispatch(toggleMissionControlDialog(false));
  };

  return (
    <Dialog open={isVisible}>
      <IconButton size="small" onClick={handleClose}>
        <CloseIcon fontSize="inherit" />
      </IconButton>
      <MissionControl />
    </Dialog>
  );
};
