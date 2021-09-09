import React from 'react';

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
  Skeleton,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';

import { InfoButtonTooltip } from 'components';

const useStyles = makeStyles(theme => ({
  noMinWidth: { minWidth: '0' },
  avatar: { margin: theme.spacing(0, 2) },
}));

const ComponentSkeleton = ({ n = 4 }) => (
  <List>
    {Array(n)
      .fill()
      .map(() => (
        // eslint-disable-next-line react/jsx-key
        <ListItem>
          <ListItemIcon>
            <Skeleton variant="circle" width="1rem" height="1rem" />
          </ListItemIcon>
          <ListItemText primary={<Skeleton width="15ch" />} />
        </ListItem>
      ))}
  </List>
);

/**
 * @template V
 * @param {{
 *   defaultValue?: V
 *   value?: V
 *   onChange: (value: V) => void
 *   options: {value: V, label?: string, image?: string, info?: string}[]
 *   isLoading?: boolean
 * }} props
 */
export const RadioGroup = ({
  defaultValue,
  value: valueProp = defaultValue,
  onChange,
  options,
  isLoading = false,
}) => {
  const styles = useStyles();

  if (!options) {
    console.warn('options prop not provided to RadioGroup');
    return null;
  }

  if (isLoading) return <ComponentSkeleton n={options.length} />;

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
