import React, { useState } from 'react';

import {
  Box,
  MapIcon,
  ProfileIcon,
  SvgIcon,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@astrosat/astrosat-ui';

import { ErrorBoundary } from 'react-error-boundary';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import Profile from 'accounts/profile/profile.component';
import { setBackgroundLocation } from 'app.slice';
import {
  Sidebar,
  SidebarItem,
  SidebarBottomItems,
  LoadMaskFallback,
  ErrorFallback,
} from 'components';
import { ReactComponent as MissionControlIcon } from 'control-panel/mission-control.svg';
import { dataSourceByIdSelector } from 'data-layers/data-layers.slice';

const Dashboard = () => {
  const location = useLocation();
  console.log('DASHBOARD LOCATION: ', location)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const sourceId = searchParams.get('source_id');
  const source = useSelector(dataSourceByIdSelector(sourceId));

  const dashboardComponentDefinition =
    source?.metadata?.application?.orbis?.dashboard_component;

  const handleProfileClose = () => setProfileOpen(false);

  if (!dashboardComponentDefinition) return null;

  const { name } = dashboardComponentDefinition;

  const Dashboard = React.lazy(() =>
    import(`./${name}/${name}Config.component`),
  );

  return (
    <>
      <Box width="100vw" height="100vh" overflow="hidden" display="flex">
        <Sidebar>
          <SidebarItem
            tooltip="Go to Map"
            onClick={() => {
              navigate('/map');
            }}
            icon={<MapIcon />}
          />
          <SidebarBottomItems>
            <SidebarItem
              tooltip="Mission Control"
              selected={location.pathname.includes('/mission-control')}
              onClick={() => {
                dispatch(setBackgroundLocation(location));
                navigate('/mission-control');
              }}
              icon={
                <SvgIcon>
                  <MissionControlIcon titleAccess="Mission Control" />
                </SvgIcon>
              }
            />
            <SidebarItem
              tooltip="Profile"
              onClick={() => setProfileOpen(true)}
              selected={profileOpen}
              icon={<ProfileIcon titleAccess="Profile" />}
            />
          </SidebarBottomItems>
        </Sidebar>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <React.Suspense fallback={<LoadMaskFallback />}>
            <Dashboard sourceId={sourceId} />
          </React.Suspense>
        </ErrorBoundary>
      </Box>
      <Dialog
        open={profileOpen}
        maxWidth="sm"
        fullWidth
        onClose={handleProfileClose}
      >
        <DialogTitle onClose={handleProfileClose}>Profile</DialogTitle>
        <DialogContent>
          <Profile />
        </DialogContent>
      </Dialog>
    </>
  );
};

export { Dashboard };
