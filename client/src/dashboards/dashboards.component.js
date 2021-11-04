import React from 'react';

import { Box, SvgIcon } from '@astrosat/astrosat-ui';

import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { setBackgroundLocation } from 'app.slice';
import { Sidebar, SidebarItem, SidebarBottomItems } from 'components';
import { ReactComponent as MissionControlIcon } from 'control-panel/mission-control.svg';
import { history } from 'root.reducer';

const Dashboards = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  return (
    <Box width="100vw" height="100vh" overflow="hidden" display="flex">
      <Sidebar>
        <SidebarBottomItems>
          <SidebarItem
            onClick={() => {
              dispatch(setBackgroundLocation(location));
              history.push('/mission-control');
            }}
            icon={
              <SvgIcon>
                <MissionControlIcon />
              </SvgIcon>
            }
          />
        </SidebarBottomItems>
      </Sidebar>
      DASHBOARD
    </Box>
  );
};

export default Dashboards;
