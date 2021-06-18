import React, { useState } from 'react';

import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import {
  toggleMissionControlDialog,
  selectIsMissionControlDialogVisible,
} from 'mission-control/mission-control-slice';

import { userSelector } from '../accounts/accounts.selectors';
import { VIEWS } from './constants';
import { MainPanel } from './main-panel/main-panel.component';
import { SidePanel } from './side-panel/side-panel.component';

const useDialogStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
  },
  paper: {
    width: `calc(100% - ${theme.typography.pxToRem(96)})`,
    height: `calc(100% - ${theme.typography.pxToRem(96)})`,
    maxHeight: '100%',
    backgroundColor: theme.palette.background.default,
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.typography.pxToRem(16),
  },
}));

const useTitleStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    '& > *': {
      color: theme.palette.common.white,
    },
  },
}));

export const MissionControl = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector(selectIsMissionControlDialogVisible);
  const user = useSelector(userSelector);
  const dialogStyles = useDialogStyles({});
  const titleStyles = useTitleStyles();

  const [mainPanelView, setMainPanelView] = useState(VIEWS.users);

  const handleClose = () => {
    return dispatch(toggleMissionControlDialog(false));
  };

  return (
    <Dialog
      open={isVisible}
      classes={dialogStyles}
      maxWidth={false}
      onBackdropClick={handleClose}
    >
      <DialogTitle classes={titleStyles}>{`Hello ${user?.name}`}</DialogTitle>
      <DialogContent>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <SidePanel
              mainPanelView={mainPanelView}
              setMainPanelView={setMainPanelView}
            />
          </Grid>
          <Grid item>
            <MainPanel mainPanelView={mainPanelView} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
