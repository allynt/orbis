import React, { useState } from 'react';

import {
  Input,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Grid,
  ListItem,
  makeStyles,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  key: {
    alignSelf: 'flex-start',
    marginRight: theme.spacing(1),
  },
  note: {
    minWidth: theme.spacing(40),
    alignItems: 'flex-start',
  },
  displays: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
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
    <>
      <ListItem className={styles.container}>
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
      </ListItem>
      <ListItem className={styles.container}>
        <Typography variant="h4" className={styles.key}>
          Note:
        </Typography>
        <Grid
          container
          direction="column"
          justify="space-between"
          className={styles.note}
        >
          <Input
            multiline
            rows={3}
            onChange={handleNoteChange}
            value={text || ''}
            placeholder="Type here..."
            inputProps={{
              'aria-label': 'Popup Note',
            }}
            disabled={!!note && !editMode}
          />
          <div className={styles.displays}>
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
          </div>
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
      </ListItem>
    </>
  );
};

export default PopupStatusAndNote;
