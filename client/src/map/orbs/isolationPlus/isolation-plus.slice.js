import { createSlice, createSelector } from '@reduxjs/toolkit';
import { orbsSelector } from '../orbsSelectors';
import { LAYER_IDS } from 'map/map.constants';

const isolationPlusSlice = createSlice({
  name: 'isolationPlus',
  initialState: {
    colorScheme: 'Blues',
    [LAYER_IDS.astrosat.isolationPlus.ahah.v0]: 'IMD: Income decile',
  },
  reducers: {
    setProperty: (state, { payload }) => {
      if (payload.source_id && payload.property)
        state[payload.source_id] = payload.property;
    },
  },
});

export const { setProperty } = isolationPlusSlice.actions;

const baseSelector = createSelector(
  orbsSelector,
  orbs => orbs[isolationPlusSlice.name],
);

export const colorSchemeSelector = createSelector(
  baseSelector,
  orb => orb?.colorScheme,
);

export const propertySelector = createSelector(
  baseSelector,
  (_, source_id) => source_id,
  (orb, source_id) => orb?.[source_id],
);

export default isolationPlusSlice.reducer;
