const labelsForArrayOfObjects = (data, keyLabel, formatter) => {
  if (!data) {
    return [];
  }
  if (!formatter) {
    formatter = item => `${item}`;
  }
  const fieldList = Object.keys(data[0]);
  const fieldsToAddUp = fieldList.filter(item => item !== keyLabel);

  return data.map(item => {
    let total = 0;
    fieldsToAddUp.forEach(fieldName => {
      total += item[fieldName];
    });
    return formatter ? formatter(total) : total;
  });
};

export { labelsForArrayOfObjects };
