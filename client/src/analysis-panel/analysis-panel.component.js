import React from 'react';

import {
  Box,
  Button,
  ButtonBase,
  CloseIcon,
  Dialog,
  Divider,
  IconButton,
  makeStyles,
  styled,
  TriangleIcon,
  Typography,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { find, get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { SidePanel } from 'components';
import { activeDataSourcesSelector } from 'data-layers/data-layers.slice';
import {
  clickedFeaturesSelector,
  otherSelector,
  setClickedFeatures,
} from 'map/orbs/layers.slice';
import { AnalysisPanelProvider } from './analysis-panel-context';
import { ClickedFeaturesSummary } from './clicked-features-summary/clicked-features-summary.component';
import { COMPONENT_MAP } from './component-map';
import { MoreInformation } from './more-information/more-information.component';
import { ReactComponent as PdfExportIcon } from './pdf-export.svg';
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

const useDialogStyles = makeStyles(theme => ({
  root: {
    height: '100%',
  },
  paper: {
    height: '100%',
    borderRadius: theme.shape.borderRadius,
  },
}));

export const AnalysisPanel = () => {
  const [minimized, setMinimized] = React.useState(false);
  const [pdfOpen, setPdfOpen] = React.useState(false);

  const styles = useStyles();
  const dialogStyles = useDialogStyles();

  const dispatch = useDispatch();
  const other = useSelector(state =>
    otherSelector('astrosat/isolation_plus')(state?.orbs),
  );
  const selectedProperty = get(other, 'property');
  const propertyOther = useSelector(state =>
    otherSelector(`${selectedProperty?.source_id}/${selectedProperty?.name}`)(
      state?.orbs,
    ),
  );
  const selectedTimestamp = get(propertyOther, 'timestamp');
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
          {!pdfIncompatible && (
            <IconButton
              aria-label="PDF export"
              className={styles.pdfButton}
              size="small"
              onClick={() => setPdfOpen(true)}
            >
              <PdfExportIcon />
            </IconButton>
          )}
        </div>
      }
    >
      <AnalysisPanelProvider
        clickedFeatures={clickedFeatures}
        currentSource={currentSource}
        selectedProperty={selectedProperty}
        selectedTimestamp={selectedTimestamp}
      >
        <Typography color="primary" className={styles.strapline}>
          The information below relates to the areas selected on the map.
        </Typography>
        <ClickedFeaturesSummary
          clickedFeatures={clickedFeatures}
          selectedProperty={selectedProperty}
          dispatch={dispatch}
          currentSource={currentSource}
          fallbackProperty={currentSource?.metadata?.index}
        />
        <PrimaryDivider />
        {dataVisualisationComponents?.map(componentDefinition => {
          const Component = COMPONENT_MAP[componentDefinition.name];
          return (
            <>
              <Component
                selectedProperty={selectedProperty}
                selectedTimestamp={selectedTimestamp}
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
            <Button className={styles.button} onClick={() => setPdfOpen(true)}>
              Export PDF Report
            </Button>
          </Box>
        )}

        <Dialog
          classes={dialogStyles}
          maxWidth="lg"
          open={pdfOpen}
          onClose={() => setPdfOpen(false)}
          aria-labelledby="pdf-export-dialog"
        >
          <PDF
            selectedProperty={selectedProperty}
            selectedTimestamp={selectedTimestamp}
            close={() => setPdfOpen(false)}
            licence={currentSource?.metadata?.licence}
          />
        </Dialog>
      </AnalysisPanelProvider>
    </SidePanel>
  );
};
