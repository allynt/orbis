import { format } from 'date-fns';

export const DATE_FORMAT = 'dd-MM-yyyy';
export const START_DATE = format(new Date('2022-05-25'), DATE_FORMAT);
export const END_DATE = format(new Date(), DATE_FORMAT);
export const API_SOURCE_ID = 'astrosat/h2orb/indicators/latest';

export const METADATA = {
  pH: {
    name: 'pH',
    info: 'pH Info',
    units: '',
    range: {
      min: 6,
      max: 9,
    },
  },
  temperature: {
    name: 'Temperature',
    info: 'Temperature Info',
    units: '°C',
    range: {
      min: 10,
      max: 40,
    },
  },
  EC: {
    name: 'Electrical Conductivity',
    info: 'Electrical Conductivity Info',
    units: '',
    range: {
      min: 150,
      max: 800,
    },
  },
  DO: {
    name: 'Dissolved Oxygen',
    info: 'Dissolved Oxygen Info',
    units: '',
    range: {
      min: 2,
      max: 11,
    },
  },
};

export const DEFAULT_DELAY = 60000; // 1 minute
