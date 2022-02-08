const labelsForArrayOfObjects = (data, keyLabel, formatter) => {
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
  console.error('totalsArray', totalsArray);

  return totalsArray;
};

export { labelsForArrayOfObjects };
