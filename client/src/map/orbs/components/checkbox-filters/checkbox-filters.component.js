import * as React from 'react';

import {
  Checkbox,
  CleaningIcon,
  ClothingIcon,
  FoodIcon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  OptionsAltIcon,
  PpeIcon,
  ServiceIcon,
  StaffingIcon,
  StationeryIcon,
  StethoscopeIcon,
  styled,
} from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import { CATEGORIES } from '../../slices/mysupplylynk.constants';
import {
  categoryFiltersSelectorFactory,
  setSelectedFeatures,
} from '../../slices/mysupplylynk.slice';

const Icons = {
  PPE: PpeIcon,
  Cleaning: CleaningIcon,
  'Medical Equipment & Aids': StethoscopeIcon,
  Food: FoodIcon,
  Stationery: StationeryIcon,
  Clothing: ClothingIcon,
  Services: ServiceIcon,
  Staff: StaffingIcon,
  Other: OptionsAltIcon,
};

const IconWrapper = styled('div')(({ theme }) => ({
  color: theme.palette.secondary.main,
  backgroundColor: theme.palette.primary.main,
  width: theme.typography.pxToRem(32),
  height: theme.typography.pxToRem(32),
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
}));

/**
 *  @param {{
 *   selectedLayer?: import('typings/orbis').Source
 *   dispatch?: import('redux').Dispatch
 * }} props
 */
export const CheckboxFilters = ({ selectedLayer, dispatch }) => {
  const selectedFilters = useSelector(state =>
    categoryFiltersSelectorFactory(selectedLayer?.source_id)(state?.orbs),
  );

  const CATEGORY_NAME_AND_ICON = CATEGORIES.map(name => ({
    name,
    Icon: Icons[name],
  }));

  /**
   * @param {string} value
   */
  const handleChange = value => () => {
    !selectedFilters?.includes(value)
      ? dispatch(
          setSelectedFeatures({
            layer: selectedLayer.source_id,
            value: [...selectedFilters, value],
          }),
        )
      : dispatch(
          setSelectedFeatures({
            layer: selectedLayer.source_id,
            value: selectedFilters.filter(feat => feat !== value),
          }),
        );
  };

  return (
    <List>
      {CATEGORY_NAME_AND_ICON.map(({ name, Icon }) => {
        const labelId = `checkbox-label-${name.replace(/\s/g, '-')}`;
        return (
          <ListItem
            key={name}
            role={undefined}
            button
            onClick={handleChange(name)}
          >
            <ListItemIcon>
              <Checkbox
                tabIndex={-1}
                checked={selectedFilters?.includes(name)}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemIcon>
              <IconWrapper>
                <Icon fontSize="small" titleAccess={name} />
              </IconWrapper>
            </ListItemIcon>
            <ListItemText id={labelId} primary={name} />
          </ListItem>
        );
      })}
    </List>
  );
};
