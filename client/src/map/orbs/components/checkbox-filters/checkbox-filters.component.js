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

import { InfoButtonTooltip, TooltipContent } from 'components';
import { ColorScale } from 'utils/ColorScale';

const useStyles = makeStyles(theme => ({
  list: {
    paddingLeft: 'unset',
    paddingRight: 'unset',
  },
  iconWrapper: {
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
  iconButton: { justifySelf: 'flex-end', alignSelf: 'center' },
}));

export const isPropertyOff = (filters, property, defaultChecked) =>
  defaultChecked
    ? filters === undefined || filters === null || !filters.includes(property)
    : filters?.includes(property);

/**
 * @param {{
 *   onChange: (newFilterValue: any[], value: any, checked: boolean) => void
 *   filterValue: any[]
 *   filters: {value: any, label?: string, icon?: string}[]
 *   color?: string
 *   colorMap?: import('typings').ColorMap
 *   iconColor?: string
 * }} props
 */
export const CheckboxFilters = ({
  onChange,
  filterValue,
  filters,
  color,
  colorMap,
  iconColor,
  defaultChecked = true,
}) => {
  if (!filters) console.error('No `filters` prop supplied to CheckboxFilters');

  const styles = useStyles({
    color,
    iconColor,
    hasIconOrColorMap: filters?.some(f => !!f.icon) || colorMap != null,
  });
  let colorScale;
  if (colorMap != null) {
    colorScale = new ColorScale({
      color: colorMap,
      domain:
        typeof filters[0].value === 'number'
          ? [filters[0].value, filters[filters.length - 1].value]
          : filters.map(f => f.value),
    });
  }

  const handleCheckboxChange = (value, checked) => () => {
    let newFilterValue;
    if (filterValue === undefined || filterValue === null)
      newFilterValue = [value];
    else if (filterValue.includes(value))
      newFilterValue = filterValue.filter(v => v !== value);
    else newFilterValue = [...filterValue, value];

    onChange(newFilterValue, value, checked);
  };

  return filters ? (
    <List disablePadding>
      {filters.map(({ value, icon, label, iconColor, bgColor, info }) => {
        const labelId = `checkbox-label-${value
          .toString()
          .replace(/\s/g, '-')}`;
        const Icon = icon && iconMap[`${icon}Icon`];
        // This is backwards, beware!
        const checked = isPropertyOff(filterValue, value, defaultChecked);
        const icColor = !iconColor && bgColor ? bgColor : iconColor;

        return (
          <ListItem
            className={styles.list}
            key={value}
            role={undefined}
            button
            onClick={handleCheckboxChange(value, checked)}
          >
            <ListItemIcon style={{ minWidth: 'max-content' }}>
              <Checkbox
                tabIndex={-1}
                checked={checked || false}
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

            {info && (
              <InfoButtonTooltip
                iconButtonClassName={styles.iconButton}
                tooltipContent={<TooltipContent description={info} />}
              />
            )}
          </ListItem>
        );
      })}
    </List>
  ) : null;
};
