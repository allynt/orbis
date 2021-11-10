import React, { useState } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import SaveAoiForm from './save-aoi-form/save-aoi-form.component';
import AoiToolbox from './toolbox/aoi-toolbox.component';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    margin: '0 auto',
    marginTop: '1rem',
  },
  dialogTitle: { position: 'relative' },
});

const Aoi = ({ onDrawAoiClick, onSubmit, aoiDrawMode, setAoiDrawMode }) => {
  const styles = useStyles();

  const [saveAoiFormOpen, setSaveAoiFormOpen] = useState(false);

  const handleSaveAoiSubmit = values => {
    setSaveAoiFormOpen(false);
    onSubmit(values);
  };

  return (
    <div className={styles.wrapper}>
      <Typography variant="h3" component="h1">
        Search
      </Typography>
      <Typography paragraph>
        Please select the Area Of Interest on the map to search for available
        data.
      </Typography>

      <AoiToolbox
        onToolSelect={tool => {
          setAoiDrawMode(tool);
          onDrawAoiClick();
        }}
        selectedTool={aoiDrawMode}
      />

      <Button
        color="secondary"
        onClick={() => setSaveAoiFormOpen(true)}
        className={styles.button}
      >
        Save
      </Button>

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
          <SaveAoiForm onSubmit={handleSaveAoiSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Aoi;
