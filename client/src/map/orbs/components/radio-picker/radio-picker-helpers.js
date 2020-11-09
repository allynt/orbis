import { numberRangeRegex } from './radio-picker-constants';

export const getRange = property => {
  const range = property.name.match(numberRangeRegex)[0];
  return range;
};

export const sortPairs = selectedLayer => {
  let percentages = [];
  let numbers = [];
  let pairs = [];

  for (let property of selectedLayer?.metadata?.properties) {
    if (property.type === 'percentage') {
      percentages = [...percentages, property];
    } else if (property.type === 'continuous') {
      numbers = [...numbers, property];
    }
  }

  percentages.forEach(perc => {
    const range = perc.name.match(numberRangeRegex)[0];
    const twin = numbers.find(num => num.name.includes(range));
    pairs = [...pairs, [perc, twin]];
  });

  return pairs;
};
