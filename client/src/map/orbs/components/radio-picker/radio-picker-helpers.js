import { numberRangeRegex, FORMAT } from './radio-picker-constants';

export const getRange = property => {
  const range = property.name.match(numberRangeRegex);
  if (!range) {
    return property.name;
  }
  return range[0];
};

export const sortPairs = selectedLayer => {
  let percentages = [];
  let numbers = [];
  let pairs = [];

  for (let property of selectedLayer?.metadata?.properties) {
    if (property.type === FORMAT.percentage) {
      percentages = [...percentages, property];
    } else if (property.type === FORMAT.number) {
      numbers = [...numbers, property];
    }
  }

  percentages.forEach((perc, i) => {
    // const range = perc.name.match(numberRangeRegex)[0];
    // const twin = numbers.find(num => num.name.includes(range));

    const num = numbers[i];
    pairs = [...pairs, [perc, num]];
  });

  return pairs;
};
