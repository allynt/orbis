export const COLORS = ['#f67971', '#eea46c', '#d8c06a', '#b3d567', '#7ef664'];

export const AOI_BUFFER = 10000; // 10 km specified as metres
export const QUERY_RESPONSE_LIMIT = 500;

export const IMPACT_SUMMARY_LEGEND_DATA = {
  'High positive': '#7ef664',
  'Low negative': '#eda46c',
  'Medium positive': '#b3d567',
  'Medium negative': '#f67971',
  'Low positive': '#c7d99f',
  'High negative': '#ff544a',
  Neutral: '#d8c06a',
};

export const GRADIENT_STOPS = {
  '0%': '#7ef664',
  '30%': '#b3d567',
  '40%': '#c7d99f',
  '50%': '#d8c06a',
  '60%': '#eda46c',
  '70%': '#f67971',
  '100%': '#ff544a',
};

export const SCORE_LEGENDS = [
  'High negative',
  'Medium negative',
  'Low negative',
  'Neutral',
  'Low positive',
  'Medium positive',
  'High positive',
];

export const IMPACT_COLUMNS = [0, 1, 2, 3, 4];
export const SCORE_VALUES = [3, 2, 1, 0, -1, -2, -3];

export const DEBOUNCE_TIMEOUT = 500;

export const AVAILABLE_ACTIVITIES_URL = 'ns/proxy/available-activities/latest';
export const SEARCH_ACTIVITIES_URL = 'ns/proxy/activities/latest';
