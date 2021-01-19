import { aggregateValues } from './aggregateValues';

describe.only('aggregateValues', () => {
  it('returns 0 if all params are undefined', () => {
    const result = aggregateValues(undefined, undefined);
    expect(result).toBe(0);
  });

  it('returns 0 if clickedFeatures is undefined', () => {
    const result = aggregateValues(undefined, { aggregation: 'mean' });
    expect(result).toBe(0);
  });

  it('returns 0 if the property name is undefined', () => {
    const result = aggregateValues([], {});
    expect(result).toBe(0);
  });

  it("returns the value from the clicked feature if there's only one", () => {
    const selectedProperty = {
      name: 'test',
    };
    const clickedFeatures = [{ object: { properties: { test: 123 } } }];
    const result = aggregateValues(clickedFeatures, selectedProperty);
    expect(result).toBe(clickedFeatures[0].object.properties.test);
  });

  it('returns the sum of the feature properties if aggregation = "sum"', () => {
    const selectedProperty = {
        name: 'test',
        aggregation: 'sum',
      },
      clickedFeatures = [
        { object: { properties: { test: 123 } } },
        { object: { properties: { test: 456 } } },
        { object: { properties: { test: 789 } } },
      ];
    const result = aggregateValues(clickedFeatures, selectedProperty);
    expect(result).toBe(123 + 456 + 789);
  });

  it('returns the mean of the feature properties if aggregation = "mean"', () => {
    const selectedProperty = {
        name: 'test',
        aggregation: 'mean',
      },
      clickedFeatures = [
        { object: { properties: { test: 123 } } },
        { object: { properties: { test: 456 } } },
        { object: { properties: { test: 789 } } },
      ];
    const result = aggregateValues(clickedFeatures, selectedProperty);
    expect(result).toBe((123 + 456 + 789) / 3);
  });

  it('returns the value to the precision specified in the property if available', () => {
    const selectedProperty = {
        name: 'test',
        aggregation: 'mean',
        precision: 3,
      },
      clickedFeatures = [
        { object: { properties: { test: 123.5 } } },
        { object: { properties: { test: 456.3 } } },
        { object: { properties: { test: 789.8 } } },
      ];
    const result = aggregateValues(clickedFeatures, selectedProperty);
    expect(result).toBe(456.533);
  });
});
