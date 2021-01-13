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
  pickedInfoSelector,
  propertySelector,
  setPickedInfo,
} from 'map/orbs/slices/isolation-plus.slice';
import { MoreInformation } from './more-information/more-information.component';
import { NationalDeviationHistogram } from './national-deviation-histogram/national-deviation-histogram.component';
import { PropertyBreakdownChart } from './property-breakdown-chart/property-breakdown-chart.component';

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
  const pickedInfo = useSelector(state => pickedInfoSelector(state?.orbs));
  const selectedProperty = useSelector(state => propertySelector(state?.orbs));

  if (!selectedProperty) return null;

  const areaValue = pickedInfo?.object?.properties?.[selectedProperty?.name];

  const pieData = selectedProperty?.breakdown?.map(breakdownProperty => ({
    value: Number(pickedInfo?.object?.properties[breakdownProperty]),
    name: breakdownProperty,
  }));

  return (
    <SidePanel
      orientation="right"
      open={
        !!selectedProperty?.application?.orbis?.data_visualisation_components &&
        !!pickedInfo
      }
      header={
        <div className={styles.header}>
          <IconButton
            className={styles.close}
            size="small"
            onClick={() => dispatch(setPickedInfo(undefined))}
          >
            <CloseIcon fontSize="inherit" />
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
      {!!areaValue && (
        <>
          <NationalDeviationHistogram
            areaValue={areaValue}
            selectedProperty={selectedProperty}
          />
          <PrimaryDivider />
        </>
      )}
      {!!selectedProperty?.breakdown && !pieData.some(v => !v.value) && (
        <>
          <PropertyBreakdownChart data={pieData} />
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
