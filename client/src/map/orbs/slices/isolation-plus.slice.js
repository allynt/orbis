import { createSlice, createSelector } from '@reduxjs/toolkit';

const DEFAULT_CLIP_POSITION = {
  translateX: 0,
  clipWidth: 400,
};

const isolationPlusSlice = createSlice({
  name: 'isolationPlus',
  initialState: {
    colorSchemes: {},
    property: {
      source_id: undefined,
      name: undefined,
    },
    pickedInfo: undefined,
    filterData: {
      filterRange: [undefined, undefined],
      clipPosition: {},
    },
  },
  reducers: {
    setProperty: (state, { payload }) => {
      state.property = payload;
      state.filterData = {
        filterRange: [payload.min, payload.max],
        clipPosition: DEFAULT_CLIP_POSITION,
      };
    },
    setPickedInfo: (state, { payload }) => {
      state.pickedInfo = payload;
    },
    setFilterData: (state, { payload }) => {
      state.filterData = {
        filterRange: payload.filterRange.map(Math.round),
        clipPosition: payload.clipPosition
          ? payload.clipPosition
          : DEFAULT_CLIP_POSITION,
      };
    },
  },
});

export const {
  setProperty,
  setPickedInfo,
  setFilterData,
} = isolationPlusSlice.actions;

const baseSelector = orbs => orbs?.[isolationPlusSlice.name];

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

export const filterDataSelector = createSelector(
  baseSelector,
  orb => orb?.filterData,
);

export default isolationPlusSlice.reducer;
