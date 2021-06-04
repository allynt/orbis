import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  CloseIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@astrosat/astrosat-ui';

import { userSelector } from '../accounts/accounts.selectors';

import {
  toggleMissionControlDialog,
  selectIsMissionControlDialogVisible,
} from 'mission-control/mission-control-slice';

import { MissionControl } from './mission-control.component';

export const MissionControlDialog = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector(selectIsMissionControlDialogVisible);
  const user = useSelector(userSelector);

  const handleClose = () => {
    return dispatch(toggleMissionControlDialog(false));
  };

  return (
    <Dialog open={isVisible}>
      <IconButton aria-label="Close" size="small" onClick={handleClose}>
        <CloseIcon fontSize="inherit" />
      </IconButton>
      <DialogTitle>{`Hello ${user?.name}`}</DialogTitle>
      <DialogContent>
        <MissionControl />
      </DialogContent>
    </Dialog>
  );
};
