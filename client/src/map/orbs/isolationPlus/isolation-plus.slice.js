import { createSlice, createSelector } from '@reduxjs/toolkit';
import { orbsSelector } from '../orbsSelectors';
import { LAYER_IDS } from 'map/map.constants';

const isolationPlusSlice = createSlice({
  name: 'isolationPlus',
  initialState: {
    colorSchemes: {
      [LAYER_IDS.astrosat.isolationPlus.imdIncome.v1]: 'Blues',
      [LAYER_IDS.astrosat.isolationPlus.ahah.v1]: 'Reds',
      [LAYER_IDS.astrosat.isolationPlus.childPoverty.v1]: 'Purples',
      [LAYER_IDS.astrosat.isolationPlus.deprivedHouses.v1]: 'Greens',
      [LAYER_IDS.astrosat.isolationPlus.localFuelPoverty.v1]: 'Oranges',
    },
    properties: {},
  },
  reducers: {
    setProperty: (state, { payload }) => {
      if (payload.source_id && payload.property)
        state.properties[payload.source_id] = payload.property;
    },
  },
});

export const { setProperty } = isolationPlusSlice.actions;

const baseSelector = createSelector(
  orbsSelector,
  orbs => orbs[isolationPlusSlice.name],
);

export const colorSchemesSelector = createSelector(
  baseSelector,
  orb => orb?.colorSchemes,
);

export const colorSchemeSelector = createSelector(
  baseSelector,
  (_, source_id) => source_id,
  (orb, source_id) => orb?.colorSchemes[source_id],
);

export const propertiesSelector = createSelector(
  baseSelector,
  orb => orb?.properties,
);

export const propertySelector = createSelector(
  baseSelector,
  (_, source_id) => source_id,
  (orb, source_id) => orb?.properties?.[source_id],
);

export default isolationPlusSlice.reducer;
