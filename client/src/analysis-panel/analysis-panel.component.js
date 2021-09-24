import React from 'react';

import {
  ButtonBase,
  CloseIcon,
  IconButton,
  makeStyles,
  TriangleIcon,
  Typography,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { find, get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { LoadingTextFallback, SidePanel } from 'components';
import { activeDataSourcesSelector } from 'data-layers/data-layers.slice';
import {
  clickedFeaturesSelector,
  hoveredFeaturesSelector,
  otherSelector,
  setClickedFeatures,
  SHARED_STATE_KEY,
  timestampSelector,
} from 'map/orbs/layers.slice';

import { ContextMenu } from './context-menu/context-menu.component';

const AnalysisPanelContent = React.lazy(() =>
  import(
    /* webpackChunkName: "AnalysisPanelContent" */ './analysis-panel-content.component'
  ),
);

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
    maxHeight: `calc(100vh - ${theme.typography.pxToRem(55)})`,
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
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  button: {
    padding: theme.spacing(1, 2),
  },
  fallback: {
    margin: theme.spacing(2),
  },
}));

export const AnalysisPanel = () => {
  const [minimized, setMinimized] = React.useState(false);
  const [pdfOpen, setPdfOpen] = React.useState(false);

  const styles = useStyles();

  const dispatch = useDispatch();
  const other = useSelector(state =>
    otherSelector(SHARED_STATE_KEY)(state?.orbs),
  );
  const selectedProperty = get(other, 'property');
  const selectedTimestamp = useSelector(state =>
    timestampSelector(
      `${selectedProperty?.source_id}/${selectedProperty?.name}`,
    )(state?.orbs),
  );
  const sources = useSelector(activeDataSourcesSelector);
  const currentSource = React.useMemo(
    () =>
      find(sources, {
        source_id: selectedProperty?.source_id,
      }),
    [selectedProperty, sources],
  );
  const clickedFeatures = useSelector(state =>
    clickedFeaturesSelector(selectedProperty?.source_id)(state?.orbs),
  );
  const hoveredFeatures = useSelector(state =>
    hoveredFeaturesSelector(selectedProperty?.source_id)(state?.orbs),
  );
  const dataVisualisationComponents =
    selectedProperty?.application?.orbis?.data_visualisation_components;

  const pdfIncompatible = selectedProperty?.type === 'discrete';

  if (!selectedProperty) return null;

  return (
    <SidePanel
      orientation="right"
      contentClassName={styles.content}
      open={
        !!dataVisualisationComponents && !!clickedFeatures?.length && !minimized
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
            onClick={() =>
              dispatch(
                setClickedFeatures({
                  key: selectedProperty?.source_id,
                  clickedFeatures: undefined,
                }),
              )
            }
          >
            <CloseIcon titleAccess="Close" fontSize="inherit" />
          </IconButton>
          <Typography variant="h2" component="h1">
            Data Analysis
          </Typography>
          <ContextMenu
            pdfIncompatible={pdfIncompatible}
            onDownloadPdfClick={() => setPdfOpen(true)}
          />
        </div>
      }
    >
      <React.Suspense fallback={<LoadingTextFallback />}>
        {!!dataVisualisationComponents && !!clickedFeatures?.length && (
          <AnalysisPanelContent
            clickedFeatures={clickedFeatures}
            currentSource={currentSource}
            selectedProperty={selectedProperty}
            selectedTimestamp={selectedTimestamp}
            dataVisualisationComponents={dataVisualisationComponents}
            hoveredFeatures={hoveredFeatures}
            pdfIncompatible={pdfIncompatible}
            pdfOpen={pdfOpen}
            setPdfOpen={setPdfOpen}
          />
        )}
      </React.Suspense>
    </SidePanel>
  );
};
