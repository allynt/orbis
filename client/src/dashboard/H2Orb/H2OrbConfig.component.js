import React, { useState } from 'react';

import { Grid, makeStyles, Typography } from '@astrosat/astrosat-ui';

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

import H2OrbProgressIndicators from './H2Orb-progress-indicators.component';
import H2OrbSkeletons from './H2Orb-skeletons';
import { getPercentage } from './H2Orb-utils/H2Orb-utils';
import {
  API_SOURCE_ID,
  DEFAULT_DELAY,
  END_DATE,
  METADATA,
  START_DATE,
} from './H2Orb.constants';

const useStyles = makeStyles(theme => ({
  dashboard: {
    padding: theme.spacing(4),
  },
}));

/**
 * @param {{
 *  percentage: number,
 *  width: number,
 *  radius: number,
 *  value: number,
 *  units: string,
 * }} props
 */
const renderCenterDisplay = ({
  percentage,
  width,
  radius,
  value,
  units = '',
}) => (
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

const transformData = data =>
  Object.entries(data.payload.params).reduce((acc, [key, value]) => {
    const { name, info, range, units } = METADATA[key];
    const percentage = getPercentage(range.min, range.max, value);
    const datum = [
      { x: 1, y: percentage ?? 0 },
      { x: 2, y: 100 - (percentage ?? 0) },
    ];

    return [
      ...acc,
      {
        name,
        info,
        data: datum,
        dateUpdated: data.data_received_time,
        renderCenterDisplay: ({ width, radius }) =>
          renderCenterDisplay({ percentage, value, width, radius, units }),
      },
    ];
  }, []);

const H2OrbHeader = () => <Typography variant="h2">H2Orb Dashboard</Typography>;

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
  const styles = useStyles();
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

  return (
    <DashboardWrapper HeaderComponent={<H2OrbHeader />}>
      <Grid
        container
        direction="column"
        alignItems="center"
        className={styles.dashboard}
      >
        {!!progressIndicators ? (
          <H2OrbProgressIndicators data={progressIndicators} />
        ) : (
          <H2OrbSkeletons />
        )}
      </Grid>
    </DashboardWrapper>
  );
};

export default H2OrbDashboard;
