import { parse } from '@loaders.gl/core';
import { CSVLoader } from '@loaders.gl/csv';

export default async function validate(file) {
  try {
    const val = await parse(file, [CSVLoader]);
    if (val.length === 0)
      throw new Error("Cannot read property 'length' of undefined");
    if (val.some(values => !Object.keys(values).includes('latitude')))
      throw new Error('Must include latitude and longitude headers');
    return false;
  } catch (error) {
    if (
      error.message.includes('No valid loader found') ||
      error.message.includes('arrayBuffer is not a function')
    )
      return 'Invalid file format. Please upload a file according to the guidelines!';
    if (
      error.message.includes(
        "Cannot read properties of undefined (reading 'length')",
      ) ||
      error.message.includes("Cannot read property 'length' of undefined")
    )
      return 'The uploaded file is empty, therefore we can not show anything on the map. Please fill it with data and start the upload process again. We are not saving this file so you don’t have to worry about it.';
    return error.message;
  }
}
