import React, { useState } from 'react';

import {
  Input,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Grid,
  makeStyles,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(0, 2),
  },
  status: {
    margin: theme.spacing(2, 0),
  },
  key: {
    alignSelf: 'flex-start',
    marginRight: theme.spacing(1),
  },
  note: {
    minWidth: theme.spacing(40),
  },
  input: {
    color: `${theme.palette.secondary.main} !important`,
  },
  displays: {
    width: '100%',
    marginBottom: theme.spacing(1),
  },
  charLimitMessage: {
    color: `${theme.palette.error.main}`,
    margin: '0',
  },
  charCount: {
    /** @param { charLimitExceeded } boolean */
    color: ({ charLimitExceeded }) =>
      charLimitExceeded
        ? `${theme.palette.error.main}`
        : `${theme.palette.primary.main}`,
  },
  buttons: {
    width: '100%',
    gap: theme.spacing(1),
  },
  button: {
    padding: theme.spacing(0.5, 0),
    minWidth: theme.spacing(16),
  },
}));

const PopupStatusAndNote = ({ id, note, onSave, status = 'NEW' }) => {
  const [text, setText] = useState(note);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [editMode, setEditMode] = useState(false);
  const [charCount, setCharCount] = useState(note?.length);

  const CHAR_LIMIT = 3000,
    charLimitExceeded = charCount > CHAR_LIMIT,
    hasChangedStatus = selectedStatus !== status,
    hasChangedNote = text !== note,
    enabled = hasChangedStatus || hasChangedNote;

  const options = {
    NEW: 'New',
    PENDING: 'Pending',
    COMPLETE: 'Complete',
    FOLLOWUP: 'Followup',
  };

  const styles = useStyles({ charLimitExceeded });

  const handleNoteChange = e => {
    setCharCount(e.target.value.length);
    setText(e.target.value);
  };

  const handleEditClick = () => {
    if (!editMode) return setEditMode(true);

    setText(note);
    setCharCount(note?.length);
    return setEditMode(false);
  };

  const handleSaveClick = () => {
    let data = { id };
    if (hasChangedNote) data.notes = text.trim();
    if (hasChangedStatus) data.status = selectedStatus;
    if (editMode) setEditMode(false);
    return onSave(data);
  };

  return (
    <Grid container direction="column" className={styles.container}>
      <Grid item container alignItems="center" className={styles.status}>
        <Typography variant="h4" className={styles.key}>
          Status:
        </Typography>
        <RadioGroup onChange={e => setSelectedStatus(e.target.value)}>
          {Object.entries(options).map(([key, value]) => (
            <FormControlLabel
              key={key}
              label={value}
              control={
                <Radio
                  name={key}
                  value={key}
                  checked={value === options[selectedStatus]}
                />
              }
            />
          ))}
        </RadioGroup>
      </Grid>
      <Grid
        item
        container
        justify="space-between"
        alignItems="center"
        wrap="nowrap"
      >
        <Typography variant="h4" className={styles.key}>
          Note:
        </Typography>
        <Grid
          item
          container
          direction="column"
          justify="space-between"
          alignItems="flex-start"
          className={styles.note}
        >
          <Input
            multiline
            rows={4}
            onChange={handleNoteChange}
            value={text || ''}
            placeholder="Type here..."
            inputProps={{
              'aria-label': 'Popup Note',
            }}
            disabled={!!note && !editMode}
            className={styles.input}
          />
          <Grid
            item
            container
            justify="space-between"
            className={styles.displays}
          >
            {charLimitExceeded ? (
              <Typography className={styles.charLimitMessage}>
                Character limit exceeded
              </Typography>
            ) : (
              <span></span>
            )}
            <Typography className={styles.charCount}>
              {charCount || '0'}/{CHAR_LIMIT}
            </Typography>
          </Grid>
          <Grid
            container
            justify="space-evenly"
            alignItems="center"
            className={styles.buttons}
          >
            <Button
              className={styles.button}
              onClick={handleSaveClick}
              disabled={!enabled || charLimitExceeded}
            >
              Save
            </Button>
            {!!note ? (
              <Button className={styles.button} onClick={handleEditClick}>
                {editMode ? 'Cancel' : 'Edit'}
              </Button>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PopupStatusAndNote;
