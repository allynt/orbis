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
    filterRange: undefined,
    brushDomain: { y: [undefined, undefined] },
    clipPosition: DEFAULT_CLIP_POSITION,
  },
  reducers: {
    setProperty: (state, { payload }) => {
      state.filterRange = [payload.min, payload.max];
      state.property = payload;
    },
    setPickedInfo: (state, { payload }) => {
      state.pickedInfo = payload;
    },
    setFilterRange: (state, { payload }) => {
      state.filterRange = payload.map(Math.round);
    },
    setBrushDomain: (state, { payload }) => {
      state.brushDomain = payload;
    },
    setClipPosition: (state, { payload }) => {
      state.clipPosition = payload;
    },
  },
});

export const {
  setProperty,
  setPickedInfo,
  setFilterRange,
  setBrushDomain,
  setClipPosition,
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

export const filterRangeSelector = createSelector(
  baseSelector,
  orb => orb?.filterRange,
);

export const brushDomainSelector = createSelector(
  baseSelector,
  orb => orb?.brushDomain,
);

export const clipPositionSelector = createSelector(
  baseSelector,
  orb => orb?.clipPosition,
);

export default isolationPlusSlice.reducer;
