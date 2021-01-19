import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  ButtonBase,
  CloseIcon,
  Divider,
  IconButton,
  makeStyles,
  styled,
  TriangleIcon,
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
import clsx from 'clsx';

const PrimaryDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
}));

const useStyles = makeStyles(theme => ({
  header: {
    position: 'relative',
    display: 'grid',
    placeItems: 'center',
  },
  close: {
    left: 0,
    position: 'absolute',
  },
  strapline: {
    padding: theme.spacing(2),
    paddingBottom: 0,
    fontStyle: 'italic',
  },
  minimize: {
    position: 'absolute',
    top: `-${theme.typography.pxToRem(1)}`,
    left: `-${theme.typography.pxToRem(36)}`,
    height: theme.typography.pxToRem(40),
    width: theme.typography.pxToRem(20),
    fontSize: theme.typography.pxToRem(12),
    backgroundColor: theme.palette.background.default,
    visibility: 'visible',
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius,
    transition: theme.transitions.create('background-color'),
    '&:hover, &:focus': {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  icon: {
    transform: 'rotate(90deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.easeInOut,
    }),
    '&$minimized': {
      transform: 'rotate(-90deg)',
      transitionDuration: theme.transitions.duration.enteringScreen,
    },
  },
  hidden: {
    visibility: 'hidden',
  },
  minimized: {},
}));

export const AnalysisPanel = () => {
  const [minimized, setMinimized] = React.useState(false);
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
        !!pickedInfo &&
        !minimized
      }
      header={
        <div className={styles.header}>
          <ButtonBase
            aria-label="minimize"
            className={clsx(styles.minimize, {
              [styles.hidden]: !pickedInfo,
            })}
            onClick={() => setMinimized(c => !c)}
          >
            <TriangleIcon
              className={clsx(styles.icon, { [styles.minimized]: minimized })}
              fontSize="inherit"
            />
          </ButtonBase>
          <IconButton
            aria-label="Close"
            className={styles.close}
            size="small"
            onClick={() => dispatch(setPickedInfo(undefined))}
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
