import { createSlice, createSelector } from '@reduxjs/toolkit';
import { orbsSelector } from '../orbsSelectors';
import { LAYER_IDS } from 'map/map.constants';

const isolationPlusSlice = createSlice({
  name: 'isolationPlus',
  initialState: {
    colorSchemes: {
      [LAYER_IDS.astrosat.isolationPlus.ageDemographics.v1]: 'RdBu',
      [LAYER_IDS.astrosat.isolationPlus.ahah.v1]: 'Reds',
      [LAYER_IDS.astrosat.isolationPlus.broadbandConnectivity.v1]: 'PuBuGn',
      [LAYER_IDS.astrosat.isolationPlus.childPoverty.v1]: 'Purples',
      [LAYER_IDS.astrosat.isolationPlus.deprivedHouses.v1]: 'Greens',
      [LAYER_IDS.astrosat.isolationPlus.imdIncome.v1]: 'Blues',
      [LAYER_IDS.astrosat.isolationPlus.localFuelPoverty.v1]: 'Oranges',
      [LAYER_IDS.astrosat.isolationPlus.mobileConnectivity.v1]: 'PuRd',
    },
    property: {
      source_id: undefined,
      name: undefined,
    },
  },
  reducers: {
    setProperty: (state, { payload }) => {
      if (payload.source_id && payload.name) {
        state.property = payload;
      }
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

export const propertySelector = createSelector(
  baseSelector,
  orb => orb?.property,
);

export default isolationPlusSlice.reducer;
