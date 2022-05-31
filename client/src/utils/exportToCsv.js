import * as FileSaver from 'file-saver';
import { utils, write } from 'xlsx';

const MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXTENSION = '.xlsx';

/**
 * takes an array of sub-arrays and creates a document for each parent
 * array, and a separate worksheet for each sub array.
 *
 * @param {array[]} data
 * @param {string} filename
 */
const exportToCsv = (data, filename) => {
  const SheetNames = new Array(data.length)
    .fill(undefined)
    .map((_, i) => `Worksheet-${i + 1}`);

  const Sheets = data
    .map(datum => utils.json_to_sheet(datum))
    .reduce(
      (acc, worksheet, i) => ({ ...acc, [SheetNames[i]]: worksheet }),
      {},
    );

  const workbook = {
    Sheets,
    SheetNames,
  };

  const fileBuffer = write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const dataBlob = new Blob([fileBuffer], { type: MIME_TYPE });
  FileSaver.saveAs(dataBlob, filename + EXTENSION);
};

export default exportToCsv;
