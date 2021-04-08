import {
  Avatar as AuiAvatar,
  Grid,
  styled,
  Typography,
} from '@astrosat/astrosat-ui';
import React from 'react';
import { v4 } from 'uuid';

const Avatar = styled(AuiAvatar)(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
}));

const Input = styled('input')({
  position: 'absolute',
  opacity: 0,
  pointerEvents: 'none',
});

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
  const labelId = `image-list-item-${v4()}`;

  const handleChange = () => onChange && onChange(value);

  return (
    <Grid item xs={3} container spacing={1} direction="column" component="li">
      <Grid item container justify="center">
        {!!src ? <Avatar src={src} alt={alt} variant="rounded" /> : null}
        {icon}
      </Grid>
      <Grid item container justify="center">
        <Input
          type="radio"
          aria-labelledby={labelId}
          onChange={handleChange}
          checked={selectedValue === value}
          name={name}
        />
        <Typography component="label" id={labelId} align="center">
          {text}
        </Typography>
      </Grid>
    </Grid>
  );
};
