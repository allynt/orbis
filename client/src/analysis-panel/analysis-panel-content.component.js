import React from 'react';

import {
  Typography,
  Button,
  Dialog,
  styled,
  Divider,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { useDispatch } from 'react-redux';
import { Box } from 'victory';

import { AnalysisPanelProvider } from './analysis-panel-context';
import { ClickedFeaturesSummary } from './clicked-features-summary/clicked-features-summary.component';
import { COMPONENT_MAP } from './component-map';
import { MoreInformation } from './more-information/more-information.component';
import PDF from './pdf-export/pdf-export.component';

const PrimaryDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
}));

const useStyles = makeStyles(theme => ({
  strapline: {
    padding: theme.spacing(2),
    paddingBottom: 0,
    fontStyle: 'italic',
  },
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

const AnalysisPanelContent = ({
  clickedFeatures,
  currentSource,
  selectedProperty,
  selectedTimestamp,
  hoveredFeatures,
  dataVisualisationComponents,
  pdfIncompatible,
  pdfOpen,
  setPdfOpen,
}) => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const dialogStyles = useDialogStyles();
  return (
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
        hoveredFeatures={hoveredFeatures}
        selectedProperty={selectedProperty}
        dispatch={dispatch}
        currentSource={currentSource}
        fallbackProperty={currentSource?.metadata?.index}
      />
      <PrimaryDivider />
      {dataVisualisationComponents
        ?.map((componentDefinition, i) => ({ id: i, ...componentDefinition }))
        .map(componentDefinition => {
          const Component = COMPONENT_MAP[componentDefinition.name];
          return (
            <React.Fragment
              key={`${componentDefinition.name}-${componentDefinition.id}`}
            >
              <Component
                selectedProperty={selectedProperty}
                selectedTimestamp={selectedTimestamp}
                clickedFeatures={clickedFeatures}
                dispatch={dispatch}
                {...componentDefinition.props}
              />
              <PrimaryDivider />
            </React.Fragment>
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
  );
};

export default AnalysisPanelContent;
