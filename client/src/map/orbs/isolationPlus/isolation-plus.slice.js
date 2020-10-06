import { createSlice, createSelector } from '@reduxjs/toolkit';
import { orbsSelector } from '../orbsSelectors';
import { LAYER_IDS } from 'map/map.constants';

const isolationPlusSlice = createSlice({
  name: 'isolationPlus',
  initialState: {
    colorSchemes: {
      [LAYER_IDS.astrosat.isolationPlus.ageDemographicsCensus.r1v2]: 'RdBu',
      [LAYER_IDS.astrosat.isolationPlus.ageDemographicsONS.r2v1]: 'PuRd',
      [LAYER_IDS.astrosat.isolationPlus.ahah.r2v1]: 'Reds',
      [LAYER_IDS.astrosat.isolationPlus.airPollution.r2v1]: 'Purples',
      [LAYER_IDS.astrosat.isolationPlus.broadbandConnectivity.v2]: 'PuBuGn',
      [LAYER_IDS.astrosat.isolationPlus.childPoverty.v2]: 'Purples',
      [LAYER_IDS.astrosat.isolationPlus.deprivedHouses.v2]: 'Greens',
      [LAYER_IDS.astrosat.isolationPlus.greenspace.r2v1]: 'Greens',
      [LAYER_IDS.astrosat.isolationPlus.healthVulnerability.r2v1]: 'Blues',
      [LAYER_IDS.astrosat.isolationPlus.generalHousing.r2v1]: 'Greens',
      [LAYER_IDS.astrosat.isolationPlus.imd.r2v1]: 'Blues',
      [LAYER_IDS.astrosat.isolationPlus.localFuelPoverty.r1v3]: 'Oranges',
      [LAYER_IDS.astrosat.isolationPlus.mobileConnectivity.v2]: 'PuRd',
      [LAYER_IDS.astrosat.isolationPlus.socialIsolation.r2v1]: 'Reds',
    },
    property: {
      source_id: undefined,
      name: undefined,
    },
    pickedInfo: undefined,
  },
  reducers: {
    setProperty: (state, { payload }) => {
      state.property = payload;
    },
    setPickedInfo: (state, { payload }) => {
      state.pickedInfo = payload;
    },
  },
});

export const { setProperty, setPickedInfo } = isolationPlusSlice.actions;

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

export const pickedInfoSelector = createSelector(
  baseSelector,
  orb => orb?.pickedInfo,
);

export default isolationPlusSlice.reducer;
