import React, { useState } from 'react';

import { Input, Button, ListItem, makeStyles } from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  key: {},
  note: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charLimitMessage: {
    color: 'red',
  },
  charCount: {
    color: ({ charLimitExceeded }) => (charLimitExceeded ? 'yellow' : 'red'),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
}));

const PopupNote = ({ note, onNoteSave, onNoteEdit }) => {
  const [charCount, setCharCount] = useState(0);
  const CHAR_LIMIT = 3000;
  const charLimitExceeded = charCount >= CHAR_LIMIT;
  const styles = useStyles({ charLimitExceeded });
  return (
    <ListItem className={styles.container}>
      <h1 className={styles.key}>Note: </h1>
      <div className={styles.note}>
        <Input multiline onChange={e => setCharCount(e.target.value.length)}>
          {note.body}
        </Input>
        <span className={styles.charCount}>
          {charCount}/{CHAR_LIMIT}
        </span>
        {charLimitExceeded && (
          <p className={styles.charLimitMessage}>Character limit exceeded</p>
        )}
        <div className={styles.buttons}>
          <Button onClick={onNoteSave} disabled={charLimitExceeded}>
            Save
          </Button>
          <Button onClick={onNoteEdit} disabled={charLimitExceeded}>
            Edit
          </Button>
        </div>
      </div>
    </ListItem>
  );
};

export default PopupNote;
