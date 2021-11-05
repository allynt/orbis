import React, { useState, useEffect } from 'react';

import { Box, SvgIcon } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { setBackgroundLocation } from 'app.slice';
import { Sidebar, SidebarItem, SidebarBottomItems } from 'components';
import { ReactComponent as MissionControlIcon } from 'control-panel/mission-control.svg';
import {
  dataSourceByIdSelector,
  selectDataToken,
} from 'data-layers/data-layers.slice';
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

const Dashboards = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const sourceId = searchParams.get('source_id');
  const source = useSelector(dataSourceByIdSelector(sourceId));
  const dataToken = useSelector(selectDataToken);
  const [data, setData] = useState();

  useEffect(() => {
    if (!data) {
      getData(dataUrlFromSource(source), dataToken).then(setData);
    }
  }, [data, dataToken, source]);

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
      <pre style={{ overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
    </Box>
  );
};

export default Dashboards;
