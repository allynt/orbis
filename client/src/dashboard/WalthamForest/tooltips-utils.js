/**
 * Creates an array a labels from an array of objects whose properties
 * we want to sum up
 *
 * @param {object[]} data - Data to generate labels for
 * @param {string} keyLabel - Do not include this property in the same (e.g. If it's a label)
 * @param {function} formatter - Optional function which takes an object and renders it as text
 *
 * @returns {any[]} An array of labels to appear over each data point
 */

const labelsForArrayOfObjects = (data, keyLabel, formatter) => {
  if (!data) {
    return [];
  }

  const fieldsToAddUp = Object.keys(data[0]).filter(item => item !== keyLabel);
  return data.map(item => {
    let total = 0;
    for (const fieldName of fieldsToAddUp) {
      total += item[fieldName];
    }
    return formatter ? formatter(total) : total;
  });
};

export { labelsForArrayOfObjects };
