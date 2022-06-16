import { format, sub } from 'date-fns';

export const DATE_FORMAT = 'dd-MM-yyyy'; // for API URL
export const API_DATE_FORMAT = 'yyyy-MM-dd HH-mm-ss';
export const DATE_DISPLAY_FORMAT = 'dd/MM/yyyy - hh:mm:ss'; // for display to user
export const START_DATE = format(sub(new Date(), { months: 2 }), DATE_FORMAT);
export const END_DATE = format(new Date(), DATE_FORMAT);
export const API_SOURCE_ID = 'astrosat/h2orb/indicators/latest';

export const DEFAULT_DELAY = 60000; // 1 minute
