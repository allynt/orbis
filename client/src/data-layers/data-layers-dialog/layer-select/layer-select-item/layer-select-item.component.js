import * as React from 'react';

import {
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { InfoButtonTooltip } from 'components';

const useStyles = makeStyles(theme => ({
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
    borderLeft: `1px solid ${theme.palette.primary.main}`,
    '&:not(:first-child)': {
      marginTop: theme.spacing(1),
    },
  },
  checkbox: {
    minWidth: '2rem',
  },
  text: {
    margin: 0,
  },
  info: {
    display: 'flex',
    alignItems: 'center',
  },
}));

/**
 * @param {{
 *   selected?: boolean
 *   source: import('typings').Source
 *   onChange: (params: {source_ids: import('typings').Source['source_id'][]; selected: boolean}) => void
 * }} props
 */
const LayerSelectItem = ({ selected, source, onChange }) => {
  const styles = useStyles();

  return (
    <ListItem
      className={styles.listItem}
      button
      onClick={() =>
        onChange({
          source_ids: [source.source_id],
          selected: !selected,
        })
      }
    >
      <ListItemIcon className={styles.checkbox}>
        <Checkbox id={source.source_id} checked={selected} />
      </ListItemIcon>
      <ListItemText
        className={styles.text}
        primaryTypographyProps={{ variant: 'body1' }}
        primary={source.metadata.label}
      />
      {source?.metadata?.description && (
        <ListItemSecondaryAction className={styles.info}>
          <InfoButtonTooltip tooltipContent={source?.metadata?.description} />
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default LayerSelectItem;
