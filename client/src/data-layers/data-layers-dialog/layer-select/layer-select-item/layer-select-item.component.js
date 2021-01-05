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

const InfoIconButton = styled(IconButton)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(8),
  padding: theme.typography.pxToRem(2),
  backgroundColor: theme.palette.grey[300],
  color: theme.palette.getContrastText(theme.palette.grey[300]),
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
              <InfoIconButton aria-label="Info" onClick={buttonClick}>
                <InfoIcon fontSize="inherit" />
              </InfoIconButton>
            </Tooltip>
          </ClickAwayListener>
        </ListItemSecondaryAction>
      )}
    </BaseLayerSelectItem>
  );
};

export default LayerSelectItem;
