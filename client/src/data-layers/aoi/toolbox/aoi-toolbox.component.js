import React from 'react';

import { IconButton, makeStyles } from '@astrosat/astrosat-ui';

import { TOOLS } from './aoi-toolbox.constants';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '0.3rem',
    color: theme.palette.background.default,
    margin: '0.5rem',
  },
}));

const AoiToolbox = ({ onToolSelect, selectedTool }) => {
  const styles = useStyles();

  const handleToolChange = tool => {
    if (onToolSelect === null) {
      return;
    }

    if (tool === selectedTool) {
      return onToolSelect('ViewMode');
    }

    onToolSelect(tool);
  };

  return (
    <span>
      {TOOLS.map(({ text, Icon, value }) => {
        return (
          <IconButton
            key={value}
            onClick={() => handleToolChange(value)}
            className={styles.button}
            size="small"
            aria-label={text}
          >
            <Icon />
          </IconButton>
        );
      })}
    </span>
  );
};

export default AoiToolbox;
