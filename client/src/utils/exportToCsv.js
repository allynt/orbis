import * as FileSaver from 'file-saver';
import { utils, write } from 'xlsx';

const MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXTENSION = '.xlsx';

/**
 * takes an array of sub-arrays and creates a document for each parent
 * array, and a separate worksheet for each sub array.
 *
 * @param {{title: string, data: object[]}[]} data
 * @param {string} filename
 */
const exportToCsv = (data, filename) => {
  const sheets = data
    .map(({ title, data }) => ({ title, data: utils.json_to_sheet(data) }))
    .reduce((acc, { title, data }) => ({ ...acc, [title]: data }), {});

  const workbook = {
    Sheets: sheets,
    SheetNames: data.map(datum => datum.title),
  };

  const fileBuffer = write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const dataBlob = new Blob([fileBuffer], { type: MIME_TYPE });
  FileSaver.saveAs(dataBlob, filename + EXTENSION);
};

export default exportToCsv;
