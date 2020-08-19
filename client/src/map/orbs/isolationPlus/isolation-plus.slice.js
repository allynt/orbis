import { createSlice, createSelector } from '@reduxjs/toolkit';
import { orbsSelector } from '../orbsSelectors';
import { LAYER_IDS } from 'map/map.constants';

const isolationPlusSlice = createSlice({
  name: 'isolationPlus',
  initialState: {
    colorSchemes: {
      [LAYER_IDS.astrosat.isolationPlus.imdIncome.v1]: 'Blues',
      [LAYER_IDS.astrosat.isolationPlus.ahah.v1]: 'Reds',
    },
    properties: {
      [LAYER_IDS.astrosat.isolationPlus.imdIncome.v1]: 'Income decile',
      [LAYER_IDS.astrosat.isolationPlus.ahah.v1]:
        'AHAH 2017: Health services decile (1=worst, 10=best)',
    },
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
  (orb, source_id) => orb?.colorSchemes?.[source_id],
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
