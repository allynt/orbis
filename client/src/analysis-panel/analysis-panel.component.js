import * as React from 'react';

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

import clsx from 'clsx';
import { isArray } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { SidePanel } from 'components';
import {
  clickedFeaturesSelector,
  propertySelector,
  setClickedFeatures,
} from 'map/orbs/slices/isolation-plus.slice';
import { ClickedFeaturesSummary } from './clicked-features-summary/clicked-features-summary.component';
import { COMPONENT_MAP } from './component-map';
import { MoreInformation } from './more-information/more-information.component';

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
  content: {
    height: `calc(100vh - ${theme.typography.pxToRem(80)})`,
    overflowX: 'hidden',
    overflowY: 'auto',
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
  const clickedFeatures = useSelector(state =>
    clickedFeaturesSelector(state?.orbs),
  );
  const selectedProperty = useSelector(state => propertySelector(state?.orbs));

  if (!selectedProperty) return null;

  const histogramProps = isArray(
    selectedProperty?.application?.orbis?.data_visualisation_components,
  )
    ? selectedProperty?.application?.orbis?.data_visualisation_components?.find(
        c => c.name === 'NationalDeviationHistogram',
      )?.props
    : selectedProperty?.application?.orbis?.data_visualisation_components
        ?.props;

  return (
    <SidePanel
      orientation="right"
      contentClassName={styles.content}
      open={
        !!selectedProperty?.application?.orbis?.data_visualisation_components &&
        !!clickedFeatures?.length &&
        !minimized
      }
      header={
        <div className={styles.header}>
          <ButtonBase
            aria-label="minimize"
            className={clsx(styles.minimize, {
              [styles.hidden]: !clickedFeatures?.length,
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
      {selectedProperty?.application?.orbis?.data_visualisation_components?.map(
        componentDefinition => {
          const Component = COMPONENT_MAP[componentDefinition.name];
          return (
            <>
              <Component
                selectedProperty={selectedProperty}
                clickedFeatures={clickedFeatures}
                dispatch={dispatch}
                {...componentDefinition.props}
              />
              <PrimaryDivider />
            </>
          );
        },
      )}
      <MoreInformation
        details={selectedProperty?.details}
        source={selectedProperty?.source}
      />
    </SidePanel>
  );
};
