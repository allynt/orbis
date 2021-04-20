import React, { useState } from 'react';

import { Input, Button, ListItem, makeStyles } from '@astrosat/astrosat-ui';

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
    alignItems: 'flex-start',
  },
  charLimitMessage: {
    color: 'red',
  },
  charCount: {
    color: props => (props.charLimitExceeded ? 'red' : 'yellow'),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: '1rem',
    '& > *': {
      padding: '0.5rem 3rem',
    },
  },
}));

const PopupNote = ({ note, onNoteSave, onNoteEdit }) => {
  const [charCount, setCharCount] = useState(0);
  const [text, setText] = useState(note?.body);

  const CHAR_LIMIT = 300,
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
        <Input multiline onChange={handleChange} value={text} />
        <span className={styles.charCount}>
          {charCount}/{CHAR_LIMIT}
        </span>
        {charLimitExceeded && (
          <p className={styles.charLimitMessage}>Character limit exceeded</p>
        )}
        <div className={styles.buttons}>
          <Button onClick={() => onNoteSave(text)} disabled={disabled}>
            Save
          </Button>
          <Button onClick={() => onNoteEdit(text)} disabled={disabled}>
            Edit
          </Button>
        </div>
      </div>
    </ListItem>
  );
};

export default PopupNote;
