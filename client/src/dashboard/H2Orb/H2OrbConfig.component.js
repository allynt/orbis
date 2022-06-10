import React, { useEffect, useState } from 'react';

import { Text } from '@visx/text';
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

import ProgressIndicators from './progress-indicators.component';

const DATE_FORMAT = 'dd-MM-yyyy';
const START_DATE = format(new Date('2022-05-25'), DATE_FORMAT);
const END_DATE = format(new Date(), DATE_FORMAT);
const API_SOURCE_ID = 'astrosat/h2orb/indicators/latest';

const METADATA = {
  pH: {
    name: 'PH',
    info: 'PH Info',
    range: {
      min: 6,
      max: 9,
    },
  },
  temperature: {
    name: 'Temperature',
    info: 'Temperature Info',
    range: {
      min: 10,
      max: 40,
    },
  },
  EC: {
    name: 'Electrical Conductivity',
    info: 'Electrical Conductivity Info',
    range: {
      min: 150,
      max: 800,
    },
  },
  DO: {
    name: 'Disolved Oxygen',
    info: 'Disolved Oxygen Info',
    range: {
      min: 2,
      max: 11,
    },
  },
};

const DEFAULT_DELAY = 60000; // 1 minute

/**
 * Calculates a percentage based on a provided min and max
 * range and a data value.
 *
 * @param {number} min
 * @param {number} max
 * @param {number} value
 * @returns {number}
 */
const getPercentage = (min, max, value) => {
  const result = ((+value - min) / (max - min)) * 100;
  return +result.toFixed(1);
};

/**
 * @param {{
 *  percentage: number,
 *  width: number,
 *  radius: number
 * }} props
 */
const renderCenterDisplay = ({ percentage, width, radius }) => (
  <Text
    width={radius}
    textAnchor="middle"
    verticalAnchor="end"
    x={radius}
    y={radius}
    dy={10}
    style={{
      fill: '#fff',
      fontSize: `${width / 150}rem`,
    }}
  >
    {`${percentage}%`}
  </Text>
);

const transformData = data =>
  Object.entries(data.payload.params).reduce((acc, [key, value]) => {
    const { name, info, range } = METADATA[key];
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
        renderCenterDisplay: ({ width, radius }) =>
          renderCenterDisplay({ width, radius, percentage }),
      },
    ];
  }, []);

const H2OrbHeader = () => <h1>H2Orb Title</h1>;

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

  // useInterval(() => {
  //   (async () => {
  //     const apiSourceId =
  //       source?.metadata?.application?.orbis?.dashboard_component
  //         ?.apiSourceId ?? API_SOURCE_ID;
  //     const url = `${apiClient.apiHost}/api/proxy/data/${apiSourceId}/?startDate=${START_DATE}&endDate=${END_DATE}`;

  //     const authToken = getAuthTokenForSource(dataTokens, {
  //       source_id: apiSourceId,
  //     });

  //     const response = await fetch(url, {
  //       credentials: 'include',
  //       headers: {
  //         Authorization: `Bearer ${authToken}`,
  //       },
  //     });

  //     const data = await response.json();
  //     console.log('DATA: ', data);

  //     const transformed = transformData(data[0]);

  //     setProgressIndicators(transformed);
  //   })();
  // }, delay);

  // console.log('PROGRESS INDICATOR DATA', progressIndicators);

  useEffect(() => {
    const transformed = transformData({
      application_name: 'AQUASENSE - AQUACULTURE',
      client_id: '1151-1193-1217-1115',
      data_received_time: '2022-05-25 16-32-20',
      dev_eui: 'ea421ba0219bb8db',
      gateway_name: 'aq_trial_ug_lkjp',
      payload: {
        $lati: 21.8553,
        $long: 88.4258,
        params: {
          DO: 6.45,
          EC: 419.91,
          pH: 7.49,
          temperature: 17.63,
        },
        timestamp: '345928983000',
      },
    });

    console.log('TRANSFORMED: ', transformed);
    setProgressIndicators(transformed);
  }, []);

  console.log('PROGRESS INDICATORS: ', progressIndicators);

  return (
    <DashboardWrapper isTabs HeaderComponent={<H2OrbHeader />}>
      <ProgressIndicators data={progressIndicators} />
    </DashboardWrapper>
  );
};

export default H2OrbDashboard;
