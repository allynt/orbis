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
  const headers = Object.keys(parsedCsv[0]);
  if (intersection(headers, ['latitude', 'longitude']).length !== 2)
    throw Error('incorrectHeaders');
}

/**
 * This is a function to validate uploaded files
 *
 * The file is parsed using `loaders.gl`,
 * what is output depends on the file type and registered loaders
 * check the docs
 *
 * The parsed file is then passed through various validation functions depending on the file type
 * which throw various errors if there's an issue
 *
 * These errors are then caught and mapped to UI friendly messages using ERROR_MAP
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
    return true;
  } catch (error) {
    return ERROR_MAP.get(error.message) ?? error.message;
  }
}
