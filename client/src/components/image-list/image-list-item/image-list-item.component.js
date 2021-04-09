import {
  Avatar,
  Grid,
  Typography,
  makeStyles,
  GridListTile,
} from '@astrosat/astrosat-ui';
import clsx from 'clsx';
import React from 'react';
import { v4 } from 'uuid';

const useStyles = makeStyles(theme => ({
  container: {
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shortest,
    }),
    height: '100%',
    padding: theme.spacing(1, 2, 2),
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
    maxWidth: '4rem',
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
    <GridListTile>
      <Grid
        component="label"
        container
        spacing={1}
        justify="center"
        className={clsx(styles.container, { [styles.checked]: checked })}
        id={labelId}
      >
        <Grid item xs={12} container justify="center">
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
            aria-labelledby={labelId}
            onChange={handleChange}
            checked={checked}
            name={name}
          />
          <Typography className={styles.text}>{text}</Typography>
        </Grid>
      </Grid>
    </GridListTile>
  );
};
