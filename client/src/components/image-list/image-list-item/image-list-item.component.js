import React from 'react';

import {
  Avatar,
  Grid,
  Typography,
  makeStyles,
  ImageListItem as AuiImageListItem,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { v4 } from 'uuid';

const useStyles = makeStyles(theme => ({
  container: {
    borderRadius: theme.shape.borderRadius,
    height: '100%',
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shortest,
    }),
    padding: theme.spacing(1),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&$checked': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  radio: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
  },
  text: {
    width: '10ch',
    textAlign: 'center',
  },
  checked: {},
}));

/**
 * @template T
 * @param {{
 *   alt?: string
 *   src?: string
 *   icon?: React.ReactNode
 *   onChange?: (value: T) => void
 *   text?: string
 *   value?: T
 * name?: string
 *   selectedValue?: T
 * }} props
 */
export const ImageListItem = ({
  text,
  src,
  alt,
  icon,
  value,
  name,
  selectedValue,
  onChange,
}) => {
  const styles = useStyles();
  const labelId = `image-list-item-${v4()}`;
  const checked = selectedValue === value;

  const handleChange = () => onChange && onChange(value);

  return (
    <AuiImageListItem>
      <Grid
        component="label"
        container
        spacing={1}
        justifyContent="center"
        className={clsx(styles.container, { [styles.checked]: checked })}
        id={labelId}
      >
        <Grid item xs={12} container justifyContent="center">
          {!!src ? (
            <Avatar
              className={styles.avatar}
              src={src}
              alt={alt}
              variant="rounded"
            />
          ) : null}
          {icon}
        </Grid>
        <Grid item>
          <input
            className={styles.radio}
            type="radio"
            tabIndex={0}
            aria-labelledby={labelId}
            onClick={handleChange}
            defaultChecked={checked}
            name={name}
          />
          <Typography className={styles.text}>{text}</Typography>
        </Grid>
      </Grid>
    </AuiImageListItem>
  );
};
