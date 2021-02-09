import {
  Checkbox,
  iconMap,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  styled,
} from '@astrosat/astrosat-ui';
import { filterValueSelector, setFilterValue } from 'map/orbs/orbReducer';
import * as React from 'react';
import { useSelector } from 'react-redux';

const IconWrapper = styled('div')(({ theme }) => ({
  color: theme.palette.secondary.main,
  backgroundColor: theme.palette.primary.main,
  width: theme.typography.pxToRem(32),
  height: theme.typography.pxToRem(32),
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
}));

const useStyles = makeStyles(theme => ({
  iconWrapper: {
    color: props => props.iconColor || theme.palette.secondary.main,
    backgroundColor: props => props.color || theme.palette.primary.main,
    width: theme.typography.pxToRem(32),
    height: theme.typography.pxToRem(32),
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
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
  const filterValue = useSelector(state =>
    filterValueSelector(selectedLayer?.source_id)(state?.orbs),
  );
  const styles = useStyles({ color, iconColor });

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

    return dispatch(setFilterValue({ source_id, filterValue: newFilterValue }));
  };

  return (
    <List>
      {filters?.map(({ value, icon, label }) => {
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
            <ListItemIcon>
              <Checkbox
                tabIndex={-1}
                checked={checked}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            {Icon && (
              <ListItemIcon>
                <div className={styles.iconWrapper}>
                  <Icon fontSize="small" titleAccess={icon} />
                </div>
              </ListItemIcon>
            )}
            <ListItemText id={labelId} primary={label || value.toString()} />
          </ListItem>
        );
      })}
    </List>
  );
};
