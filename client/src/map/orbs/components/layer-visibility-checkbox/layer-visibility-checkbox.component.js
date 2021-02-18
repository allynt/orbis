import React from 'react';

import {
  Checkbox,
  FormControlLabel,
  makeStyles,
  iconMap,
  Grid,
} from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import { layersVisibilitySelector, setVisibility } from '../../orbReducer.js';
import { InfoButtonTooltip } from 'components/index.js';

const useStyles = makeStyles(theme => ({
  root: { margin: 0, padding: theme.spacing(0, 2) },
  label: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    borderRadius: '50%',
    backgroundColor: props => props.color || theme.palette.primary.main,
    color: props =>
      props.color
        ? theme.palette.getContrastText(props.color)
        : theme.palette.secondary.main,
    display: 'grid',
    placeItems: 'center',
    height: '2rem',
    width: '2rem',
    margin: theme.spacing(0, 1),
    flexShrink: 0,
  },
  infoIcon: {
    justifySelf: 'flex-end',
  },
}));

/**
 *  @type {import('typings/orbis.js').SidebarComponent<{
 *   color?: string
 *   icon?: string
 *   info?: string
 * }>}
 */
export const LayerVisibilityCheckbox = ({
  selectedLayer,
  dispatch,
  color,
  icon,
  info,
}) => {
  const classes = useStyles({ color });

  const isVisible = useSelector(state =>
    layersVisibilitySelector(selectedLayer?.source_id)(state?.orbs),
  );

  const handleChange = () =>
    dispatch(
      setVisibility({
        source_id: selectedLayer?.source_id,
        visible: !isVisible,
      }),
    );

  const Icon = icon ? iconMap[`${icon}Icon`] : null;

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs>
        <FormControlLabel
          id="label"
          classes={{ root: classes.root, label: classes.label }}
          label={
            <>
              {!!color || !!icon ? (
                <div className={classes.icon} role="presentation">
                  {Icon && <Icon fontSize="small" titleAccess={icon} />}
                </div>
              ) : null}
              {selectedLayer?.metadata.label}
            </>
          }
          control={
            <Checkbox
              tabIndex={-1}
              checked={isVisible}
              inputProps={{ 'aria-labelledby': 'label' }}
              onChange={handleChange}
            />
          }
        />
      </Grid>
      {!!info ? (
        <Grid item xs={1}>
          <InfoButtonTooltip
            iconButtonClassName={classes.infoIcon}
            tooltipContent={info}
          />
        </Grid>
      ) : null}
    </Grid>
  );
};
