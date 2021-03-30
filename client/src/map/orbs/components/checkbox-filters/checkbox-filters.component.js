import {
  Checkbox,
  iconMap,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@astrosat/astrosat-ui';
import { filterValueSelector, setFilterValue } from 'map/orbs/orbReducer';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { logProperty } from 'data-layers/data-layers.slice';

const useStyles = makeStyles(theme => ({
  iconWrapper: {
    color: props => props.iconColor || theme.palette.secondary.main,
    backgroundColor: props => props.color || theme.palette.primary.main,
    width: '2rem',
    height: '2rem',
    minWidth: '2rem',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    margin: theme.spacing(0, 2),
  },
  checkboxWrapper: {
    minWidth: 'max-content',
  },
  label: {
    marginLeft: props => !props.hasIcon && theme.spacing(2),
  },
}));

/**
 * @type {import('typings/orbis').SidebarComponent<{
 *   filters: {value: any, label?: string, icon?: string}[]
 *   color?: string
 *   iconColor?: string
 * >}
 */
export const CheckboxFilters = ({
  selectedLayer,
  dispatch,
  filters,
  color,
  iconColor,
}) => {
  if (!filters) console.error('No `filters` prop supplied to CheckboxFilters');

  const filterValue = useSelector(state =>
    filterValueSelector(selectedLayer?.source_id)(state?.orbs),
  );
  const styles = useStyles({
    color,
    iconColor,
    hasIcon: filters?.some(f => !!f.icon),
  });

  /**
   * @param {any} value
   */
  const handleChange = value => () => {
    dispatch(logProperty(selectedLayer, value));

    const { source_id } = selectedLayer;
    let newFilterValue;
    if (filterValue === undefined || filterValue === null)
      newFilterValue = [value];
    else if (filterValue.includes(value))
      newFilterValue = filterValue.filter(v => v !== value);
    else newFilterValue = [...filterValue, value];

    return dispatch(setFilterValue({ source_id, filterValue: newFilterValue }));
  };

  return filters ? (
    <List disablePadding>
      {filters.map(({ value, icon, label }) => {
        const labelId = `checkbox-label-${value
          .toString()
          .replace(/\s/g, '-')}`;
        const Icon = icon && iconMap[`${icon}Icon`];
        const checked =
          filterValue === undefined ||
          filterValue === null ||
          !filterValue.includes(value);
        return (
          <ListItem
            key={value}
            role={undefined}
            button
            onClick={handleChange(value)}
          >
            <ListItemIcon style={{ minWidth: 'max-content' }}>
              <Checkbox
                tabIndex={-1}
                checked={checked}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            {Icon && (
              <ListItemIcon className={styles.iconWrapper}>
                <Icon fontSize="small" titleAccess={icon} />
              </ListItemIcon>
            )}
            <ListItemText
              className={styles.label}
              id={labelId}
              primary={label || value.toString()}
            />
          </ListItem>
        );
      })}
    </List>
  ) : null;
};
