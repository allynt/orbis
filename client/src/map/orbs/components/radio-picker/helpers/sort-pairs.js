import { FORMAT } from '../radio-picker-constants';

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
  percentages.forEach(perc => {
    const num = numbers.find(n => n.property_group === perc.property_group);
    pairs = [...pairs, [perc, num]];
  });

  return pairs;
};
