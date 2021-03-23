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

  if (!options) {
    console.warn('options prop not provided to RadioGroup');
    return null;
  }

  return (
    <List>
      {options.map(({ value: optionValue, label, image, info }) => {
        const labelId = `radio-group-label-${optionValue}`;
        return (
          <ListItem
            key={optionValue}
            button
            onClick={() => onChange(optionValue)}
            selected={valueProp === optionValue}
          >
            <ListItemIcon className={clsx({ [styles.noMinWidth]: !!image })}>
              <Radio
                tabIndex={-1}
                checked={valueProp === optionValue}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            {!!image ? (
              <ListItemAvatar
                className={clsx(styles.noMinWidth, styles.avatar)}
              >
                <Avatar src={image} alt={`${label} image`} />
              </ListItemAvatar>
            ) : null}
            <ListItemText id={labelId} primary={label} />
            {!!info ? (
              <ListItemSecondaryAction>
                <InfoButtonTooltip placement="right" tooltipContent={info} />
              </ListItemSecondaryAction>
            ) : null}
          </ListItem>
        );
      })}
    </List>
  );
};
