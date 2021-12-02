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
import { selectedAoiSelector } from 'data-layers/aoi/aoi.slice';
import {
  dataSourceByIdSelector,
  selectDataToken,
} from 'data-layers/data-layers.slice';

import { ChartWrapper } from '../charts/chart-wrapper.component';
import AreaOfficeContactDetails from './area-office-contact-details.component';
import { NearestProtectedAreas } from './nearest-protected-areas';
import ProtectedFeature from './protected-feature/protected-feature.component';

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
    gap: '1rem',
  },
  item: {
    width: 'calc(50% - 1rem)',
  },
}));

const BUTTONS = [
  { label: 'Species' },
  { label: 'Geology' },
  { label: 'Habitat' },
];

const TYPES = ['warning', 'not-good', 'neutral', 'good', 'very-good'];

const PROTECTED_FEATURES = Array(5)
  .fill()
  .map((_, i) => {
    return {
      id: i,
      // icon: faker.image.imageUrl(),
      title: `Title ${i}`,
      description: `Description ${i}`,
      type: TYPES[Math.floor(Math.random() * TYPES.length)],
    };
  });

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

const NatureScotDashboard = ({ sourceId }) => {
  const styles = useStyles();

  const [nearestProtectedAreas, setNearestProtectedAreas] = useState([]);
  const [caseworks, setCaseworks] = useState([]);
  const [protectedFeatures, setProtectedFeatures] = useState([]);
  const [contactDetails, setContactDetails] = useState({});
  const authToken = useSelector(selectDataToken);
  const selectedAoi = useSelector(selectedAoiSelector);
  const source = useSelector(dataSourceByIdSelector(sourceId));

  console.log('protectedFeatures: ', protectedFeatures);

  const proxyUrl =
    source?.metadata?.application?.orbis?.dashboard_component?.proxyUrl;

  useEffect(() => {
    // Fetch data from IR API.
    const queryApi = async () => {
      try {
        const body = {
          feature: feature(selectedAoi.geometry),
        };
        const response = await apiClient.dashboard.getNatureScotlandIRDashboardData(
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
        // setProtectedFeatures(PROTECTED_FEATURES);
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
  }, []);

  const renderRowSubComponent = React.useCallback(
    ({ row }) => (
      <Grid className={styles.subRow} container>
        <Grid item xs={3}>
          <Typography variant="h4">Caseword Title:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography>{row.original.name}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h4">Site Name:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography>{row.original.name}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h4">Site Type:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography>{row.original.name}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h4">Casework Decision:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography>{row.original.status}</Typography>
        </Grid>
      </Grid>
    ),
    [],
  );

  return (
    <Grid
      container
      className={styles.dashboard}
      // rowSpacing={1}
      // columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    >
      <Grid item className={styles.item}>
        <NearestProtectedAreas data={nearestProtectedAreas} />
      </Grid>

      <Grid item className={styles.item}>
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
      </Grid>

      <Grid item className={styles.item}>
        <ProtectedFeature
          buttons={BUTTONS}
          features={protectedFeatures}
          onSubmit={() => console.log('Category Clicked')}
        />
      </Grid>

      <Grid item className={styles.item}>
        <AreaOfficeContactDetails contactDetails={contactDetails} />
      </Grid>
    </Grid>
  );
};

export default NatureScotDashboard;
