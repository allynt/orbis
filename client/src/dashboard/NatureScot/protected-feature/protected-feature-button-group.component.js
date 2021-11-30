import React, { useState } from 'react';

import {
  makeStyles,
  ToggleButton,
  ToggleButtonGroup,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: '#333f48',
    '&.Mui-selected': {
      backgroundColor: '#f6be00',
    },
  },
}));

const ProtectedFeatureButtonGroup = ({ buttons, onSubmit }) => {
  const styles = useStyles();

  const [selected, setSelected] = useState(buttons[0].label);

  const handleChange = (event, value) => {
    setSelected(value);
    onSubmit(value);
  };

  return (
    <ToggleButtonGroup exclusive onChange={handleChange}>
      {buttons.map(({ label }) => {
        return (
          <ToggleButton
            key={label}
            value={label}
            size="small"
            className={styles.button}
            selected={selected === label}
          >
            {label}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
};

export default ProtectedFeatureButtonGroup;
