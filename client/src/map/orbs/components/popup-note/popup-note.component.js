import React, { useState } from 'react';

import {
  Input,
  Button,
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

const PopupNote = ({ id, note, onNoteSave }) => {
  const [charCount, setCharCount] = useState(note?.body?.length);
  const [text, setText] = useState(note?.body);
  const [editMode, setEditMode] = useState(false);

  const CHAR_LIMIT = 3000,
    charLimitExceeded = charCount > CHAR_LIMIT,
    hasMadeChanges = text !== note?.body,
    disabled = charLimitExceeded || !hasMadeChanges;

  const styles = useStyles({ charLimitExceeded });

  const handleChange = e => {
    setCharCount(e.target.value.length);
    setText(e.target.value);
  };

  const handleEditClick = () => {
    if (!editMode) return setEditMode(true);

    setText(note?.body);
    setCharCount(note?.body?.length);
    return setEditMode(false);
  };

  const handleSaveClick = () => {
    setEditMode(false);
    return onNoteSave({ id, data: text.trim() });
  };

  return (
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
          onChange={handleChange}
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
            disabled={disabled || (!!note && !editMode)}
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
  );
};

export default PopupNote;
