import React, { useEffect, useState } from 'react';

import { Grid, makeStyles, Typography } from '@astrosat/astrosat-ui';

import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';
import { NotificationManager } from 'react-notifications';
import { useSelector } from 'react-redux';
import { useSortBy } from 'react-table';

import apiClient from 'api-client';
import ExpandableTable from 'components/table/expandable/expandable-table.component';
import { selectedAoiSelector } from 'data-layers/aoi/aoi.slice';
import { selectDataToken } from 'data-layers/data-layers.slice';

import { ChartWrapper } from '../charts/chart-wrapper.component';
import { NearestProtectedAreas } from './nearest-protected-areas';
import ProtectedFeature from './protected-feature/protected-feature.component';

const useStyles = makeStyles(theme => ({
  dashboard: {
    // justifyContent: 'space-between',
    // alignItems: 'center',
    overflowY: 'scroll',
  },
  header: {
    padding: '2rem',
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  },
}));

const NEAREST_PROTECTED_AREAS = [
  { name: 'Loch Lomond', type: 'National Park', distance: 4 },
  { name: 'Drumnadrochit', type: 'Protected Area', distance: 8 },
  { name: 'Ardnamurchan', type: 'National Park', distance: 12 },
  { name: 'Glenfinnan', type: 'Historic Site', distance: 13 },
  { name: 'Glencoe', type: 'SSSI', distance: 32 },
  { name: 'Tarbert', type: 'Historic Site', distance: 34 },
  { name: 'Cumbernauld', type: 'Supersite', distance: 39 },
  { name: 'Culzean Castle', type: 'Historic Site', distance: 55 },
];

const BUTTONS = [
  { label: 'button one' },
  { label: 'button two' },
  { label: 'button three' },
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

const CASEWORKS = [
  {
    code: '9540',
    received: '"2003-01-16T00:00:00.000Z"',
    response:
      'C1 - No objection - little or no natural heritage interests affected',
    type: 'SEPA Consultations',
    subRows: undefined,
  },
  {
    code: '11878',
    received: '"2003-06-26T00:00:00.000Z"',
    response:
      'C1 - No objection - little or no natural heritage interests affected',
    type: 'Other Developments',
    subRows: undefined,
  },
  {
    code: '13626',
    received: '"2003-09-12T00:00:00.000Z"',
    response:
      'C4 - No objection but recommend conditions/modifications - natural heritage interests of lesser importance with substantial development impacts',
    type: 'Scottish Forestry Grant Scheme',
    subRows: undefined,
  },
  {
    code: '13629',
    received: '"2003-08-14T00:00:00.000Z"',
    response: 'B. Support',
    type: 'Woodland Grant Scheme',
    subRows: undefined,
  },
  {
    code: '13058',
    received: '"2003-08-14T00:00:00.000Z"',
    response:
      'C1 - No objection - little or no natural heritage interests affected',
    type: 'Housing Developments',
    subRows: undefined,
  },
  {
    code: '11062',
    received: '"2003-05-09T00:00:00.000Z"',
    response: 'Information/Advice only',
    type: 'Housing Developments',
    subRows: undefined,
  },
  {
    code: '15485',
    received: '"2003-12-23T00:00:00.000Z"',
    response: 'Information/Advice only',
    type: 'Site Search',
    subRows: undefined,
  },
];

const COLUMNS = [
  {
    Header: 'Code',
    accessor: 'code',
  },
  {
    Header: 'Received',
    accessor: 'received',
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

const NatureScotDashboard = () => {
  const styles = useStyles();

  const [nearestProtectedAreas, setNearestProtectedAreas] = useState([]);
  const [caseworks, setCaseworks] = useState([]);
  const [protectedFeatures, setProtectedFeatures] = useState([]);
  const authToken = useSelector(selectDataToken);

  const selectedAoi = useSelector(selectedAoiSelector);
  console.log('SELECTED AOI: ', selectedAoi);

  useEffect(() => {
    // Fetch data from IR API.
    const queryApi = async () => {
      try {
        const response = await apiClient.dashboard.getNatureScotlandIRDashboardData(
          selectedAoi.geometry,
          { headers: { Authorization: `Bearer ${authToken}` } },
        );
        console.log('IR API RESPONSE: ', response);

        setNearestProtectedAreas(NEAREST_PROTECTED_AREAS);
        setCaseworks(CASEWORKS);
        setProtectedFeatures(PROTECTED_FEATURES);
      } catch (error) {
        const { message, status } = error;
        NotificationManager.error(
          `${status} ${message}`,
          `Fetching Bookmark Error - ${message}`,
          50000,
          () => {},
        );
      }

      setNearestProtectedAreas(NEAREST_PROTECTED_AREAS);
      setCaseworks(CASEWORKS);
      setProtectedFeatures(PROTECTED_FEATURES);
    };

    queryApi();
  }, []);

  const renderRowSubComponent = React.useCallback(({ row }) => {
    console.log('ROW DATA: ', row.original);
    return (
      <Grid
        container
        rowSpacing={1}
        coloumnSpacing={{ xs: 1, sm: 2, md: 3 }}
        className={styles.dashboard}
      >
        <Grid item xs={1}>
          <Typography variant="h4">Caseword Title:</Typography>
        </Grid>
        <Grid item xs={11}>
          <Typography>Type Title Here</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="h4">Site Name:</Typography>
        </Grid>
        <Grid item xs={11}>
          <Typography>Type Title Here</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="h4">Site Type:</Typography>
        </Grid>
        <Grid item xs={11}>
          <Typography>Type Title Here</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography variant="h4">Casework Decsion:</Typography>
        </Grid>
        <Grid item xs={11}>
          <Typography>Type Title Here</Typography>
        </Grid>
      </Grid>
    );
  }, []);

  return (
    <Grid
      container
      className={styles.header}
      rowSpacing={1}
      coloumnSpacing={{ xs: 4, sm: 2, md: 3 }}
    >
      <Grid item xs={6}>
        <NearestProtectedAreas data={nearestProtectedAreas} />
      </Grid>

      <Grid item xs={6}>
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

      <Grid item xs={6}>
        <ProtectedFeature
          buttons={BUTTONS}
          features={protectedFeatures}
          onSubmit={() => console.log('Category Clicked')}
        />
      </Grid>

      <Grid item xs={6}>
        <ChartWrapper title="Area Office Contact Details">
          <div>Contact Details</div>
        </ChartWrapper>
      </Grid>
    </Grid>
  );
};

export default NatureScotDashboard;
