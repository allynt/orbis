import React, { useState } from 'react';

import { Text } from '@visx/text';
import { useSelector } from 'react-redux';

import apiClient from 'api-client';
import DashboardWrapper from 'dashboard/shared-components/dashboard-wrapper.component';
import {
  selectDataToken,
  dataSourceByIdSelector,
} from 'data-layers/data-layers.slice';
import { useInterval } from 'hooks/useInterval';
import { getAuthTokenForSource } from 'utils/tokens';

import {
  API_SOURCE_ID,
  DEFAULT_DELAY,
  END_DATE,
  METADATA,
  START_DATE,
} from './H2Orb.constants';
import ProgressIndicators from './progress-indicators.component';

/**
 * Calculates a percentage based on a provided min and max
 * range and a data value.
 *
 * @param {number} min
 * @param {number} max
 * @param {number} value
 * @returns {number}
 */
export const getPercentage = (min, max, value) => {
  const result = ((+value - min) / (max - min)) * 100;
  return +result.toFixed(1);
};

/**
 * @param {{
 *  percentage: number,
 *  width: number,
 *  radius: number,
 *  value: number,
 *  units: string,
 * }} props
 */
const renderCenterDisplay = ({ percentage, width, radius, value, units }) => (
  <Text
    width={radius}
    textAnchor="middle"
    verticalAnchor="end"
    x={radius}
    y={radius}
    dy={10}
    style={{
      fill: '#fff',
      fontSize: `${width / 250}rem`,
    }}
  >
    {`${value} ${units}`}
  </Text>
);

const transformData = data => {
  const dateUpdated = data.data_received_time;
  return Object.entries(data.payload.params).reduce((acc, [key, value]) => {
    const { name, info, range, units } = METADATA[key];
    const percentage = getPercentage(range.min, range.max, value);
    const data = [
      { x: 1, y: percentage ?? 0 },
      { x: 2, y: 100 - (percentage ?? 0) },
    ];

    return [
      ...acc,
      {
        name,
        info,
        data,
        dateUpdated,
        renderCenterDisplay: ({ width, radius }) =>
          renderCenterDisplay({ percentage, value, width, radius, units }),
      },
    ];
  }, []);
};

const H2OrbHeader = () => <h1>H2Orb Dashboard</h1>;

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
      const apiSourceId =
        source?.metadata?.application?.orbis?.dashboard_component
          ?.apiSourceId ?? API_SOURCE_ID;
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

      const transformed = transformData(data[0]);

      setProgressIndicators(transformed);
    })();
  }, delay);

  // console.log('PROGRESS INDICATOR DATA', progressIndicators);

  // useEffect(() => {
  //   const transformed = transformData({
  //     application_name: 'AQUASENSE - AQUACULTURE',
  //     client_id: '1151-1193-1217-1115',
  //     data_received_time: '2022-05-25 16-32-20',
  //     dev_eui: 'ea421ba0219bb8db',
  //     gateway_name: 'aq_trial_ug_lkjp',
  //     payload: {
  //       $lati: 21.8553,
  //       $long: 88.4258,
  //       params: {
  //         DO: 4.45,
  //         EC: 790,
  //         pH: 7.87,
  //         temperature: 26.63,
  //       },
  //       timestamp: '345928983000',
  //     },
  //   });

  //   console.log('TRANSFORMED: ', transformed);
  //   setProgressIndicators(transformed);
  // }, []);

  return (
    <DashboardWrapper isTabs HeaderComponent={<H2OrbHeader />}>
      <ProgressIndicators data={progressIndicators} />
    </DashboardWrapper>
  );
};

export default H2OrbDashboard;
