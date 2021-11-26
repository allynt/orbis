import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  makeStyles,
  styled,
  Typography,
} from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import { dashboardSourcesSelector } from 'data-layers/data-layers.slice';
import { useMap } from 'MapContext';

import AoiList from './aoi-list/aoi-list.component';
import { aoiSelector, aoiListSelector } from './aoi.slice';
import SaveAoiForm from './save-aoi-form/save-aoi-form.component';
import AoiToolbox from './toolbox/aoi-toolbox.component';

const useStyles = makeStyles({
  button: {
    margin: '0 auto',
    marginTop: '1rem',
  },
  buttons: {
    margin: '0 auto',
  },
  dialogTitle: { position: 'relative' },
});

const PrimaryDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  marginTop: '0.5rem',
}));

const NATURE_SCOTLAND_NAMESPACE = 'nature-scotland';

const Aoi = ({
  onDrawAoiClick,
  onSubmit,
  aoiDrawMode,
  setAoiDrawMode,
  fetchAois,
  selectAoi,
  editAoiDetails,
  deleteAoi,
}) => {
  const styles = useStyles();
  const { createScreenshot, viewState, setViewState } = useMap();

  const [saveAoiFormOpen, setSaveAoiFormOpen] = useState(false);
  const [aoi, setAoi] = useState(null);

  const aois = useSelector(aoiListSelector);
  const isAoiVisible = useSelector(aoiSelector);

  const dashboardDataSources = useSelector(dashboardSourcesSelector);
  const natureScotlandSource = dashboardDataSources.find(
    source => source.namespace === NATURE_SCOTLAND_NAMESPACE,
  );

  useEffect(() => {
    if (!aois) {
      fetchAois();
    }
  }, [aois, fetchAois]);

  const handleSaveAoiSubmit = values => {
    setSaveAoiFormOpen(false);
    aoi
      ? editAoiDetails({ ...aoi, ...values })
      : createScreenshot(thumbnail =>
          onSubmit({
            ...values,
            thumbnail,
            data_source: natureScotlandSource.source_id,
          }),
        );
  };

  const handleToolSelect = tool => {
    setAoiDrawMode(tool);
    if (tool !== 'ModifyMode') {
      onDrawAoiClick();
    }
  };

  return (
    <Grid container direction="column">
      <Typography variant="h3" component="h1">
        Search
      </Typography>
      <Typography paragraph>
        Please select the Area Of Interest on the map to search for available
        data.
      </Typography>

      <AoiToolbox onToolSelect={handleToolSelect} selectedTool={aoiDrawMode} />

      <div className={styles.buttons}>
        <Button
          color="secondary"
          onClick={() => {
            setAoi(null);
            setSaveAoiFormOpen(true);
          }}
          className={styles.button}
          disabled={!isAoiVisible}
        >
          Save
        </Button>
      </div>

      <PrimaryDivider />
      <Box py={3} px={1}>
        <AoiList
          aois={aois}
          selectAoi={aoi => selectAoi({ aoi, viewState, setViewState })}
          editAoiDetails={aoi => {
            setAoi(aoi);
            setSaveAoiFormOpen(true);
          }}
          deleteAoi={aoi => deleteAoi(aoi)}
        />
      </Box>

      <Dialog
        open={saveAoiFormOpen}
        onClose={() => setSaveAoiFormOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          className={styles.dialogTitle}
          onClose={() => setSaveAoiFormOpen(false)}
        >
          Name Your Aoi
        </DialogTitle>
        <DialogContent>
          <SaveAoiForm aoi={aoi} onSubmit={handleSaveAoiSubmit} />
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default Aoi;
