import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  CloseIcon,
  Divider,
  IconButton,
  makeStyles,
  styled,
  Typography,
} from '@astrosat/astrosat-ui';

import { SidePanel } from 'components';
import {
  clickedFeaturesSelector,
  propertySelector,
  setClickedFeatures,
} from 'map/orbs/slices/isolation-plus.slice';
import { MoreInformation } from './more-information/more-information.component';
import { NationalDeviationHistogram } from './national-deviation-histogram/national-deviation-histogram.component';
import { PropertyBreakdownChart } from './property-breakdown-chart/property-breakdown-chart.component';
import { ClickedFeaturesSummary } from './clicked-features-summary/clicked-features-summary.component';

const PrimaryDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
}));

const useStyles = makeStyles(theme => ({
  header: {
    display: 'grid',
    placeItems: 'center',
  },
  close: {
    position: 'absolute',
  },
  strapline: {
    padding: theme.spacing(2),
    paddingBottom: 0,
    fontStyle: 'italic',
  },
}));

export const AnalysisPanel = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const clickedFeatures = useSelector(state =>
    clickedFeaturesSelector(state?.orbs),
  );
  const selectedProperty = useSelector(state => propertySelector(state?.orbs));

  if (!selectedProperty) return null;

  return (
    <SidePanel
      orientation="right"
      open={
        !!selectedProperty?.application?.orbis?.data_visualisation_components &&
        !!clickedFeatures?.length
      }
      header={
        <div className={styles.header}>
          <IconButton
            aria-label="Close"
            className={styles.close}
            size="small"
            onClick={() => dispatch(setClickedFeatures(undefined))}
          >
            <CloseIcon titleAccess="Close" fontSize="inherit" />
          </IconButton>
          <Typography variant="h2" component="h1">
            Data Analysis
          </Typography>
        </div>
      }
    >
      <Typography color="primary" className={styles.strapline}>
        The information below relates to the areas selected on the map.
      </Typography>
      <ClickedFeaturesSummary
        clickedFeatures={clickedFeatures}
        dispatch={dispatch}
      />
      <PrimaryDivider />
      <NationalDeviationHistogram
        selectedProperty={selectedProperty}
        clickedFeatures={clickedFeatures}
        {...selectedProperty?.application?.orbis?.data_visualisation_components
          ?.props}
      />
      <PrimaryDivider />
      {!!selectedProperty?.breakdown && (
        <>
          <PropertyBreakdownChart
            selectedProperty={selectedProperty}
            clickedFeatures={clickedFeatures}
          />
          <PrimaryDivider />
        </>
      )}
      <MoreInformation
        details={selectedProperty?.details}
        source={selectedProperty?.source}
      />
    </SidePanel>
  );
};
