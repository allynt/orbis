import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Radio,
} from '@astrosat/astrosat-ui';
import clsx from 'clsx';
import { InfoButtonTooltip } from 'components';
import React from 'react';

const useStyles = makeStyles(theme => ({
  noMinWidth: { minWidth: '0' },
  avatar: { margin: theme.spacing(0, 2) },
}));

export const RadioGroup = ({
  defaultValue,
  value: valueProp = defaultValue,
  onChange,
  options,
}) => {
  const styles = useStyles();

  return (
    <List>
      {options.map(({ value: optionValue, label, image, info }) => (
        <ListItem
          key={optionValue}
          button
          onClick={() => onChange(optionValue)}
          selected={valueProp === optionValue}
        >
          <ListItemIcon className={clsx({ [styles.noMinWidth]: !!image })}>
            <Radio tabIndex={-1} checked={valueProp === optionValue} />
          </ListItemIcon>
          {!!image ? (
            <ListItemAvatar className={clsx(styles.noMinWidth, styles.avatar)}>
              <Avatar src={image} />
            </ListItemAvatar>
          ) : null}
          <ListItemText primary={label} />
          {!!info ? (
            <ListItemSecondaryAction>
              <InfoButtonTooltip placement="right" tooltipContent={info} />
            </ListItemSecondaryAction>
          ) : null}
        </ListItem>
      ))}
    </List>
  );
};
