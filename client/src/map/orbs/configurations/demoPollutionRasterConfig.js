import { format } from 'date-fns';
import { otherSelector } from '../orbReducer';

const DEFAULT_GAS = 'no2',
  DEFAULT_DATE = new Date(2020, 6, 0).getTime();

/** @type {import('typings/orbis').LayerConfiguration} */
export default ({ id, data, authToken, orbState }) => {
  const other = otherSelector(`astrosat/demo/air_pollution/*`)(orbState);

  return {
    id,
    image: `${data}/${other?.gas || DEFAULT_GAS}_${format(
      new Date(other?.date || DEFAULT_DATE),
      'yyyyMM',
    )}.png`,
    bounds: [
      -3.967199999999999,
      55.78510000000001,
      -3.067199999999999,
      56.28510000000001,
    ],
    loadOptions: {
      fetch: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    },
  };
};
