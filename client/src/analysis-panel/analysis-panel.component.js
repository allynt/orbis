import React from 'react';
import ReactDOM from 'react-dom';

import {
  Box,
  Button,
  ButtonBase,
  CloseIcon,
  Divider,
  IconButton,
  makeStyles,
  styled,
  TriangleIcon,
  Typography,
} from '@astrosat/astrosat-ui';

import { ReactComponent as PdfExportIcon } from './pdf-export.svg';

import { useMap } from 'MapContext';

import clsx from 'clsx';
import { find } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { SidePanel } from 'components';
import { activeDataSourcesSelector } from 'data-layers/data-layers.slice';
import {
  clickedFeaturesSelector,
  propertySelector,
  setClickedFeatures,
  setScreenshot,
} from 'map/orbs/slices/isolation-plus.slice';
import { ClickedFeaturesSummary } from './clicked-features-summary/clicked-features-summary.component';
import { COMPONENT_MAP } from './component-map';
import { MoreInformation } from './more-information/more-information.component';
import PDF from './pdf-export/pdf-export.component';

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
  pdfButton: {
    right: 0,
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
}));

export const AnalysisPanel = ({ user }) => {
  const [minimized, setMinimized] = React.useState(false);
  const [pdfOpen, setPdfOpen] = React.useState(false);

  const styles = useStyles();
  const dispatch = useDispatch();
  const clickedFeatures = useSelector(state =>
    clickedFeaturesSelector(state?.orbs),
  );
  const selectedProperty = useSelector(state => propertySelector(state?.orbs));
  const sources = useSelector(activeDataSourcesSelector);
  const currentSource = React.useMemo(
    () =>
      find(sources, {
        source_id: selectedProperty?.source_id,
      }),
    [selectedProperty, sources],
  );
  const dataVisualisationComponents =
    selectedProperty?.application?.orbis?.data_visualisation_components;

  const pdfIncompatible = selectedProperty?.type === 'discrete';

  const { createScreenshot } = useMap();

  const togglePdf = () => setPdfOpen(!pdfOpen);

  const handleExportClick = () => {
    createScreenshot(screenshot => dispatch(setScreenshot(screenshot)));
    return togglePdf();
  };

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
            onClick={() => dispatch(setClickedFeatures(undefined))}
          >
            <CloseIcon titleAccess="Close" fontSize="inherit" />
          </IconButton>
          <Typography variant="h2" component="h1">
            Data Analysis
          </Typography>
          {!pdfIncompatible && (
            <IconButton
              aria-label="PDF export"
              className={styles.pdfButton}
              size="small"
              onClick={handleExportClick}
            >
              <PdfExportIcon />
            </IconButton>
          )}
        </div>
      }
    >
      <Typography color="primary" className={styles.strapline}>
        The information below relates to the areas selected on the map.
      </Typography>
      <ClickedFeaturesSummary
        clickedFeatures={clickedFeatures}
        dispatch={dispatch}
        fallbackProperty={currentSource?.metadata?.index}
      />
      <PrimaryDivider />
      {dataVisualisationComponents?.map(componentDefinition => {
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
      })}
      <MoreInformation
        currentSource={currentSource}
        selectedProperty={selectedProperty}
      />
      {!pdfIncompatible && (
        <Box className={styles.buttonContainer}>
          <Button className={styles.button} onClick={handleExportClick}>
            Export PDF Report
          </Button>
        </Box>
      )}

      {pdfOpen &&
        ReactDOM.createPortal(
          <PDF close={togglePdf} user={user} />,
          document.body,
        )}
    </SidePanel>
  );
};
