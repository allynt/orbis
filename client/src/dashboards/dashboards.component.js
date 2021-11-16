import React, { useEffect, useState } from 'react';

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
import { useLocation } from 'react-router-dom';

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
import {
  dataSourceByIdSelector,
  selectDataToken,
} from 'data-layers/data-layers.slice';
import { setData, dataSelector } from 'map/orbs/layers.slice';
import { history } from 'root.reducer';
import { dataUrlFromSource } from 'utils/data';

const getData = async (url, token) => {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

// const useSourceData = sourceId => {
//   const dispatch = useDispatch();
//   const source = useSelector(dataSourceByIdSelector(sourceId));
//   const dataToken = useSelector(selectDataToken);
//   const data = useSelector(state => dataSelector(sourceId)(state?.orbs));

//   useEffect(() => {
//     if (!data || typeof data === 'string') {
//       getData(dataUrlFromSource(source), dataToken).then(data =>
//         dispatch(setData({ key: source.source_id, data })),
//       );
//     }
//   }, [data, dataToken, source, dispatch]);

//   return data;
// };

const Dashboards = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [profileOpen, setProfileOpen] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const sourceId = searchParams.get('source_id');
  // const source = useSelector(dataSourceByIdSelector(sourceId));
  // const data = useSourceData(sourceId);

  // const dashboardComponentDefinition =
  //   source.metadata.application.orbis.dashboard_component;

  const handleProfileClose = () => setProfileOpen(false);

  // if (!dashboardComponentDefinition) return null;

  // const { name, props: dashboardProps = {} } = dashboardComponentDefinition;

  const Dashboard = React.lazy(() =>
    import(`./components/TestDashboard.component`),
  );

  return (
    <>
      <Box width="100vw" height="100vh" overflow="hidden" display="flex">
        <Sidebar>
          <SidebarItem
            tooltip="Go to Map"
            onClick={() => {
              history.push('/map');
            }}
            icon={<MapIcon />}
          />
          <SidebarBottomItems>
            <SidebarItem
              tooltip="Mission Control"
              selected={location.pathname.includes('/mission-control')}
              onClick={() => {
                dispatch(setBackgroundLocation(location));
                history.push('/mission-control');
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
            <Dashboard />
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

export { Dashboards };
