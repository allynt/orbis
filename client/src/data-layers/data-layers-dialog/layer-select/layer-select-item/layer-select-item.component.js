import React, { useState } from 'react';

import {
  Checkbox,
  ClickAwayListener,
  IconButton,
  InfoIcon,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  styled,
} from '@astrosat/astrosat-ui';

const BaseLayerSelectItem = styled(ListItem)(({ theme }) => ({
  borderLeft: `1px solid ${theme.palette.primary.main}`,
}));

/**
 * @param {{
 *   className?: string
 *   selected?: boolean
 *   source: import('typings/orbis').Source
 *   onChange: (params: {source_ids: import('typings/orbis').Source['source_id'][]; selected: boolean}) => void
 * }} props
 */
const LayerSelectItem = ({ className, selected, source, onChange }) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const buttonClick = () => {
    setIsInfoVisible(c => !c);
  };

  return (
    <BaseLayerSelectItem
      className={className}
      button
      onClick={() =>
        onChange({
          source_ids: [source.source_id],
          selected: !selected,
        })
      }
    >
      <ListItemIcon>
        <Checkbox id={source.source_id} checked={selected} />
      </ListItemIcon>
      <ListItemText primary={source.metadata.label} />
      {source?.metadata?.description && (
        <ListItemSecondaryAction>
          <ClickAwayListener onClickAway={() => setIsInfoVisible(false)}>
            <Tooltip
              arrow
              placement="left"
              disableHoverListener
              disableFocusListener
              disableTouchListener
              open={isInfoVisible}
              title={source.metadata.description}
            >
              <IconButton aria-label="Info" size="small" onClick={buttonClick}>
                <InfoIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </ClickAwayListener>
        </ListItemSecondaryAction>
      )}
    </BaseLayerSelectItem>
  );
};

export default LayerSelectItem;
