import React, { useState } from 'react';

import {
  Input,
  Button,
  Typography,
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
    margin: '0 1rem 0 0',
  },
  note: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minWidth: '20rem',
    alignItems: 'flex-start',
  },
  charLimitMessage: {
    color: 'red',
    margin: '0',
  },
  charCount: {
    width: '100%',
    textAlign: 'end',
    color: ({ charLimitExceeded }) => (charLimitExceeded ? 'red' : 'yellow'),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    gap: '1rem',
  },
  button: {
    padding: '0.5rem 3rem',
  },
}));

const PopupNote = ({ note, onNoteSave, onNoteEdit }) => {
  const [charCount, setCharCount] = useState(note?.body?.length);
  const [text, setText] = useState(note?.body);

  const CHAR_LIMIT = 3000,
    charLimitExceeded = charCount >= CHAR_LIMIT,
    hasMadeChanges = text !== note?.body,
    disabled = charLimitExceeded || !hasMadeChanges;

  const styles = useStyles({ charLimitExceeded });

  const handleChange = e => {
    setCharCount(e.target.value.length);
    setText(e.target.value);
  };

  return (
    <ListItem className={styles.container}>
      <h4 className={styles.key}>Note:</h4>
      <div className={styles.note}>
        <Input multiline onChange={handleChange} value={text || ''} />
        <Typography className={styles.charCount}>
          {charCount || '0'}/{CHAR_LIMIT}
        </Typography>
        {charLimitExceeded && (
          <p className={styles.charLimitMessage}>Character limit exceeded</p>
        )}
        <div className={styles.buttons}>
          <Button
            className={styles.button}
            onClick={() => onNoteSave(text)}
            disabled={disabled}
          >
            Save
          </Button>
          <Button
            className={styles.button}
            onClick={() => onNoteEdit(text)}
            disabled={disabled}
          >
            Edit
          </Button>
        </div>
      </div>
    </ListItem>
  );
};

export default PopupNote;
