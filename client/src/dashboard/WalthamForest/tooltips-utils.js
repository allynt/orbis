const labelsForArrayOfObjects = (data, keyLabel, formatter) => {
  // for each object in array, sum its properties, excluding the one specified
  // in keyLabel. Optionally pass in a function to format
  // the string for the tooltip text
  if (!data) {
    return [];
  }
  if (!formatter) {
    formatter = item => `${item}`;
  }
  let totalsArray = [];

  const fieldList = Object.keys(data[0]);
  const fieldsToAddUp = fieldList.filter(item => item !== keyLabel);
  for (let index in data) {
    let total = 0;
    for (let fieldName of fieldsToAddUp) {
      total += data[index][fieldName];
    }
    totalsArray.push(formatter(total));
  }

  return totalsArray;
};

export { labelsForArrayOfObjects };
