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
 *   sourceOrProperty: {id: string, label: string, description: string},
 *   onChange: (params: {source_ids: import('typings').Source['source_id'][]; selected: boolean}) => void
 *   isValid: boolean
 * }} props
 */
const LayerSelectItem = ({ selected, sourceOrProperty, onChange, isValid }) => {
  const styles = useStyles();
  const { id, label, description } = sourceOrProperty;
  return (
    <ListItem
      className={styles.listItem}
      button
      onClick={onChange}
      disabled={!isValid}
    >
      <ListItemIcon className={styles.checkbox}>
        <Checkbox id={id} checked={selected} />
      </ListItemIcon>
      <ListItemText
        className={styles.text}
        primaryTypographyProps={{ variant: 'body1' }}
        primary={label}
      />
      {description && (
        <ListItemSecondaryAction className={styles.info}>
          <InfoButtonTooltip tooltipContent={description} />
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default LayerSelectItem;
