import React, { useEffect, useState } from 'react';

import { Grid, makeStyles, Typography } from '@astrosat/astrosat-ui';

import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';
import { feature } from '@turf/turf';
import { format } from 'date-fns';
import { NotificationManager } from 'react-notifications';
import { useSelector } from 'react-redux';
import { useSortBy } from 'react-table';

import apiClient from 'api-client';
import ExpandableTable from 'components/table/expandable/expandable-table.component';
import {
  dataSourceByIdSelector,
  selectDataToken,
} from 'data-layers/data-layers.slice';
import { getAuthTokenForSource } from 'utils/tokens';

import { ChartWrapper } from '../../charts/chart-wrapper.component';
import { AOI_BUFFER, QUERY_RESPONSE_LIMIT } from '../nature-scotland.constants';
import AreaOfficeContactDetails, {
  AreaOfficeContactDetailsSkeleton,
} from './area-office-contact-details.component';
import {
  NearestProtectedAreas,
  NearestProtectedAreasSkeleton,
} from './nearest-protected-areas';
import ProtectedFeature, {
  ProtectedFeatureSkeleton,
} from './protected-feature/protected-feature.component';

const useStyles = makeStyles(theme => ({
  subRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dashboard: {
    justifyContent: 'space-between',
    padding: '2rem',
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    overflowY: 'scroll',
    height: '100vh',
    gap: '1rem',
  },
  item: {
    width: 'calc(50% - 1rem)',
  },
  wrapper: {
    width: '100%',
  },
  tab: {},
  assessmentButton: {
    marginLeft: 'auto',
    marginRight: '2rem',
  },
  areas: {
    '& *': {
      margin: '0.5rem 0.5rem 0.5rem 0.5rem',
    },
  },
}));

const BUTTONS = [
  { label: 'Species' },
  { label: 'Geology' },
  { label: 'Habitat' },
];

const COLUMNS = [
  {
    Header: 'Code',
    accessor: 'name',
  },
  {
    Header: 'Received',
    accessor: 'date',
    Cell: ({ value }) => format(new Date(value), 'dd/MM/yyyy'),
  },
  {
    // Make an expander cell
    Header: () => null, // No header
    id: 'expander', // It needs an ID
    Cell: ({ row }) => (
      // Use Cell to render an expander for each row.
      // We can use the getToggleRowExpandedProps prop-getter
      // to build the expander.
      <span {...row.getToggleRowExpandedProps()}>
        {row.isExpanded ? <ArrowDropUp /> : <ArrowDropDown />}
      </span>
    ),
  },
];

const Charts = ({ sourceId, selectedAoi }) => {
  const styles = useStyles();

  const [nearestProtectedAreas, setNearestProtectedAreas] = useState([]);
  const [caseworks, setCaseworks] = useState([]);
  const [protectedFeatures, setProtectedFeatures] = useState([]);
  const [contactDetails, setContactDetails] = useState({});

  const source = useSelector(dataSourceByIdSelector(sourceId));
  const authTokens = useSelector(selectDataToken);

  const authToken = getAuthTokenForSource(authTokens, source);

  const proxyUrl =
    source?.metadata?.application?.orbis?.dashboard_component?.proxyUrl;

  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <Grid className={styles.subRow} container>
        <Grid item xs={3}>
          <Typography variant="h4">Site Name:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography>{row.original.site_name}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h4">Casework Decision:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography>{row.original.status}</Typography>
        </Grid>
      </Grid>
    ),
    [styles.subRow],
  );

  useEffect(() => {
    // Fetch data from IR API.

    const queryApi = async () => {
      try {
        const body = {
          buffer: AOI_BUFFER,
          limit: QUERY_RESPONSE_LIMIT,
          feature: feature(selectedAoi.geometry),
        };
        const response =
          await apiClient.dashboard.getNatureScotlandIRDashboardData(
            proxyUrl,
            body,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
              },
            },
          );

        setNearestProtectedAreas(response.protected_areas);
        setCaseworks(response.casework);
        setContactDetails(response.contact_details?.[0]);
        setProtectedFeatures(response.protected_features);
      } catch (error) {
        const { message, status } = error;
        NotificationManager.error(
          `${status} ${message}`,
          `Fetching Dashboard Data Error - ${message}`,
          50000,
          () => {},
        );
      }
    };

    queryApi();
  }, [authToken, proxyUrl, selectedAoi]);

  return (
    <Grid container className={styles.dashboard}>
      <Grid item className={styles.item}>
        {nearestProtectedAreas.length === 0 ? (
          <NearestProtectedAreasSkeleton />
        ) : (
          <NearestProtectedAreas data={nearestProtectedAreas} />
        )}
      </Grid>

      <Grid item className={styles.item}>
        {caseworks.length === 0 ? (
          <NearestProtectedAreasSkeleton />
        ) : (
          <ChartWrapper
            title="List of Casework"
            info="An expandable table of each relevant casework."
          >
            <ExpandableTable
              columns={COLUMNS}
              data={caseworks}
              pluginHooks={[useSortBy]}
              renderRowSubComponent={renderRowSubComponent}
            />
          </ChartWrapper>
        )}
      </Grid>

      <Grid item className={styles.item}>
        {Object.keys(protectedFeatures).length === 0 ? (
          <ProtectedFeatureSkeleton />
        ) : (
          <ProtectedFeature
            buttons={BUTTONS}
            features={protectedFeatures}
            onSubmit={() => console.log('Category Clicked')}
          />
        )}
      </Grid>

      <Grid item className={styles.item}>
        {Object.keys(contactDetails).length === 0 ? (
          <AreaOfficeContactDetailsSkeleton />
        ) : (
          <AreaOfficeContactDetails contactDetails={contactDetails} />
        )}
      </Grid>
    </Grid>
  );
};

export default Charts;
