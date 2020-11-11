import { numberRangeRegex, FORMAT } from './radio-picker-constants';

export const getLabel = property => {
  const range = property.name.match(numberRangeRegex);
  if (!range) {
    return property.name;
  }
  return range[0];
};

export const sortPairs = selectedLayer => {
  let percentages = [];
  let numbers = [];

  for (let property of selectedLayer?.metadata?.properties) {
    if (property.type === FORMAT.percentage) {
      percentages = [...percentages, property];
    } else if (property.type === FORMAT.number) {
      numbers = [...numbers, property];
    }
  }

  let pairs = [];
  percentages.forEach((perc, i) => {
    const num = numbers[i];
    pairs = [...pairs, [perc, num]];
  });

  return pairs;
};
