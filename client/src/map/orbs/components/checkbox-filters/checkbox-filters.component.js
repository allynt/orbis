import * as React from 'react';

import {
  Checkbox,
  iconMap,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import { logProperty } from 'data-layers/data-layers.slice';
import { filterValueSelector, setFilterValue } from 'map/orbs/layers.slice';
import { ColorScale } from 'utils/ColorScale';

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
    marginLeft: props => !props.hasIconOrColorMap && theme.spacing(2),
  },
}));

const isPropertyOff = (filters, property) => {
  return (
    filters === undefined || filters === null || !filters.includes(property)
  );
};

/**
 * @type {import('typings').SidebarComponent<{
 *   filters: {value: any, label?: string, icon?: string}[]
 *   color?: string
 *   colorMap?: import('typings').ColorMap
 *   iconColor?: string
 * }>}
 */
export const CheckboxFilters = ({
  selectedLayer,
  dispatch,
  filters,
  color,
  colorMap,
  iconColor,
}) => {
  if (!filters) console.error('No `filters` prop supplied to CheckboxFilters');

  const filterValue = useSelector(state =>
    filterValueSelector(selectedLayer?.source_id)(state?.orbs),
  );
  const styles = useStyles({
    color,
    iconColor,
    hasIconOrColorMap: filters?.some(f => !!f.icon) || colorMap != null,
  });
  let colorScale;
  if (colorMap != null)
    colorScale = new ColorScale({
      color: colorMap,
      domain:
        typeof filters[0].value === 'number'
          ? [filters[0].value, filters[filters.length - 1].value]
          : filters.map(f => f.value),
    });

  /**
   * @param {any} value
   */
  const handleChange = value => () => {
    const { source_id } = selectedLayer;
    let newFilterValue;
    if (filterValue === undefined || filterValue === null)
      newFilterValue = [value];
    else if (filterValue.includes(value))
      newFilterValue = filterValue.filter(v => v !== value);
    else newFilterValue = [...filterValue, value];

    dispatch(setFilterValue({ key: source_id, filterValue: newFilterValue }));
    return dispatch(
      logProperty(selectedLayer, value, !isPropertyOff(filterValue, value)),
    );
  };

  return filters ? (
    <List disablePadding>
      {filters.map(({ value, icon, label, bgColor }) => {
        const labelId = `checkbox-label-${value
          .toString()
          .replace(/\s/g, '-')}`;
        const Icon = icon && iconMap[`${icon}Icon`];
        const checked = isPropertyOff(filterValue, value);
        const icColor = !iconColor && bgColor ? bgColor : iconColor;

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
            {(Icon || colorScale) && (
              <ListItemIcon
                className={styles.iconWrapper}
                style={{
                  backgroundColor: bgColor ? bgColor : colorScale?.get(value),
                  color: icColor,
                }}
              >
                {Icon && <Icon fontSize="small" titleAccess={icon} />}
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
