import { Avatar, Grid, Typography, makeStyles } from '@astrosat/astrosat-ui';
import React from 'react';
import { v4 } from 'uuid';

const useStyles = makeStyles(theme => ({
  container: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'hotpink',
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

  const handleChange = () => onChange && onChange(value);

  return (
    <Grid item xs={3} container spacing={1} direction="column" component="li">
      <label className={styles.container} id={labelId}>
        <Grid item container justify="center">
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
        <Grid item container justify="center">
          <input
            className={styles.radio}
            type="radio"
            aria-labelledby={labelId}
            onChange={handleChange}
            checked={selectedValue === value}
            name={name}
          />
          <Typography component="span" align="center">
            {text}
          </Typography>
        </Grid>
      </label>
    </Grid>
  );
};
