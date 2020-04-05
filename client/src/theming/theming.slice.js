import { createSlice } from '@reduxjs/toolkit';

export const themes = [
  {
    value: 'light',
    label: 'Light'
  },
  {
    value: 'dark',
    label: 'Dark'
  }
];

const initialState = {
  themes,
  selectedTheme: themes[1]
};

const themingSlice = createSlice({
  name: 'theming',
  initialState,
  reducers: {
    selectTheme: (state, { payload }) => {
      state.selectedTheme = themes.find(theme => theme.value === payload);
    }
  }
});

export const { selectTheme } = themingSlice.actions;

export default themingSlice.reducer;
