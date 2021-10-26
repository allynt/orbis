import { parse, selectLoader, registerLoaders } from '@loaders.gl/core';
import { CSVLoader } from '@loaders.gl/csv';
import { intersection } from 'lodash';

import { ERROR_MAP } from './error-map';

registerLoaders([CSVLoader]);

const PARSE_OPTIONS = { csv: { header: true } };

/**
 * @param {any[]} array
 */
function notEmpty(array) {
  if (array.length === 0) throw Error('emptyFile');
}

/**
 * @param {{}[]} parsedCsv
 */
function validateCsv(parsedCsv) {
  const headers = Object.keys(parsedCsv[0]).map(v => v.toLowerCase());
  if (
    intersection(headers, ['latitude', 'lat', 'longitude', 'lon', 'long'])
      .length !== 2
  )
    throw Error('incorrectHeaders');
}

/**
 * @param {File} file
 */
export default async function validate(file) {
  try {
    const loader = await selectLoader(file);
    const parsedFile = await parse(file, PARSE_OPTIONS);
    notEmpty(parsedFile);
    switch (loader.name) {
      case CSVLoader.name:
      default:
        validateCsv(parsedFile);
    }
    return false;
  } catch (error) {
    return ERROR_MAP.get(error.message) ?? error.message;
  }
}
