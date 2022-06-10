import React, { useState } from 'react';

import { format } from 'date-fns';
import { useSelector } from 'react-redux';

import apiClient from 'api-client';
import DashboardWrapper from 'dashboard/shared-components/dashboard-wrapper.component';
import {
  selectDataToken,
  dataSourceByIdSelector,
} from 'data-layers/data-layers.slice';
import { useInterval } from 'hooks/useInterval';
import { getAuthTokenForSource } from 'utils/tokens';

const H2OrbHeader = () => <h1>H2Orb Title</h1>;
const DATE_FORMAT = 'dd-MM-yyyy';
const START_DATE = format(new Date('2022-05-25'), DATE_FORMAT);
const END_DATE = format(new Date(), DATE_FORMAT);
const apiSourceId = 'astrosat/h2orb/indicators/latest';

const DEFAULT_DELAY = 60000; // 1 minute

/**
 * Dashboard for H2Orb
 *
 * This dashboard shows a number of charts, relaying the latest data from the
 * H2Orb API. The data is polled periodically, and the charts updated.
 * There is likely to be another chart though, that will be updated on change
 * to the date selector, this will show a line chart across a period of time.
 *
 * @param {{ sourceId: string }} props
 */
const H2OrbDashboard = ({ sourceId }) => {
  const [progressIndicators, setProgressIndicators] = useState(null);

  const dataTokens = useSelector(selectDataToken);
  const source = useSelector(dataSourceByIdSelector(sourceId));

  const delay =
    source?.metadata?.application?.orbis?.dashboard_component?.delay * 1000 ||
    DEFAULT_DELAY;

  useInterval(() => {
    (async () => {
      const url = `${apiClient.apiHost}/api/proxy/data/${apiSourceId}/?startDate=${START_DATE}&endDate=${END_DATE}`;

      const authToken = getAuthTokenForSource(dataTokens, {
        source_id: apiSourceId,
      });

      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      console.log('DATA: ', data);

      setProgressIndicators(data[0]);
    })();
  }, delay);

  console.log('PROGRESS INDICATOR DATA', progressIndicators);

  return (
    <DashboardWrapper isTabs HeaderComponent={<H2OrbHeader />}>
      <h1>H2Orb Dashboard Content</h1>
    </DashboardWrapper>
  );
};

export default H2OrbDashboard;
