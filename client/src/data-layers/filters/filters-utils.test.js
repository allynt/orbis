import { filterValueIsPresent, areAnyFilterValuesPresent, getFilterOptions } from './filters-utils';

describe('filterValueIsPresent', () => {
  it('throws an error if the item is undefined', () => {
    const object = { cars: { engine: ['V8'] } };
    expect(() => filterValueIsPresent(object, undefined)).toThrow(TypeError);
  });

  it('throws an error if the item is null', () => {
    const object = { cars: { engine: ['V8'] } };
    expect(() => filterValueIsPresent(object, null)).toThrow(TypeError);
  });

  it('returns false if item does not have layer', () => {
    const object = { cars: { engine: ['V8'] } };
    const item = { property: 'engine', value: 'V8' };
    expect(filterValueIsPresent(object, item)).toBe(false);
  });

  it('returns false if item does not have property', () => {
    const object = { cars: { engine: ['V8'] } };
    const item = { layer: 'cars', value: 'V8' };
    expect(filterValueIsPresent(object, item)).toBe(false);
  });

  it('returns false if item does not have value', () => {
    const object = { cars: { engine: ['V8'] } };
    const item = { layer: 'cars', property: 'engine' };
    expect(filterValueIsPresent(object, item)).toBe(false);
  });

  it('returns false if the object is undefined', () => {
    const item = { layer: 'cars', property: 'engine', value: 'V8' };
    expect(filterValueIsPresent(undefined, item)).toBe(false);
  });

  it('returns false if the object is empty', () => {
    const item = { layer: 'cars', property: 'engine', value: 'V8' };
    expect(filterValueIsPresent({}, item)).toBe(false);
  });

  it("returns false if the layer can't be found", () => {
    const object = { fruit: { type: ['tropical'] } };
    const item = { layer: 'cars', property: 'engine', value: 'V8' };
    expect(filterValueIsPresent(object, item)).toBe(false);
  });

  it("returns false if the property can't be found", () => {
    const object = { cars: { make: ['BMW'] } };
    const item = { layer: 'cars', property: 'engine', value: 'V8' };
    expect(filterValueIsPresent(object, item)).toBe(false);
  });

  it("return false if the value can't be found", () => {
    const object = { cars: { engine: ['V12'] } };
    const item = { layer: 'cars', property: 'engine', value: 'V8' };
    expect(filterValueIsPresent(object, item)).toBe(false);
  });

  it('returns true if the value can be found', () => {
    const object = { cars: { engine: ['V8'] } };
    const item = { layer: 'cars', property: 'engine', value: 'V8' };
    expect(filterValueIsPresent(object, item)).toBe(true);
  });
});

describe('areAnyFilterValuesPresent', () => {
  it('returns true if any values are found', () => {
    const filterObject = { cars: { engine: ['V12'] } };
    expect(areAnyFilterValuesPresent(filterObject)).toBe(true);
  });

  it('return false if no filter values are present', () => {
    const filterObject = { cars: { engine: [] } };
    expect(areAnyFilterValuesPresent(filterObject)).toBe(false);
  });

  it('returns false if no properties are found', () => {
    const filterObject = { cars: {} };
    expect(areAnyFilterValuesPresent(filterObject)).toBe(false);
  });

  it('returns false if no layers are found', () => {
    const filterObject = {};
    expect(areAnyFilterValuesPresent(filterObject)).toBe(false);
  });

  it('returns false if the filter object is undefined', () => {
    expect(areAnyFilterValuesPresent(undefined)).toBe(false);
  });

  it('returns false if the filter object is null', () => {
    expect(areAnyFilterValuesPresent(null)).toBe(false);
  });
});

describe('getFilterOptions', () => {
  it('single value properties', () => {
    const filterableCollection = [
      { fruit: 'apple' },
      { fruit: 'orange' },
      { fruit: 'banana' },
      { fruit: 'apple' },
      { fruit: 'banana' },
    ];
    const filter = 'fruit';
    const expected = { [filter]: ['apple', 'orange', 'banana'] };
    const result = getFilterOptions(filter, filterableCollection);
    expect(result).toEqual(expected);
  });

  it('array properties', () => {
    const filterableCollection = [
      { fruit: ['apple', 'orange'] },
      { fruit: ['orange', 'lemon'] },
      { fruit: ['banana', 'apple'] },
      { fruit: ['apple'] },
      { fruit: ['banana'] },
    ];
    const filter = 'fruit';
    const expected = { [filter]: ['apple', 'orange', 'lemon', 'banana'] };
    const result = getFilterOptions(filter, filterableCollection);
    expect(result).toEqual(expected);
  });

  it('nested single value properties', () => {
    const filterableCollection = [
      { 'fruit-bowl': { fruit: 'apple' } },
      { 'fruit-bowl': { fruit: 'orange' } },
      { 'fruit-bowl': { fruit: 'banana' } },
      { 'fruit-bowl': { fruit: 'apple' } },
      { 'fruit-bowl': { fruit: 'banana' } },
    ];
    const filter = 'fruit-bowl.fruit';
    const expected = { [filter]: ['apple', 'orange', 'banana'] };
    const result = getFilterOptions(filter, filterableCollection);
    expect(result).toEqual(expected);
  });

  it('nested array properties', () => {
    const filterableCollection = [
      { 'fruit-bowl': { fruit: ['apple', 'orange'] } },
      { 'fruit-bowl': { fruit: ['orange', 'lemon'] } },
      { 'fruit-bowl': { fruit: ['banana', 'apple'] } },
      { 'fruit-bowl': { fruit: ['apple'] } },
      { 'fruit-bowl': { fruit: ['banana'] } },
    ];
    const filter = 'fruit-bowl.fruit';
    const expected = { [filter]: ['apple', 'orange', 'lemon', 'banana'] };
    const result = getFilterOptions(filter, filterableCollection);
    expect(result).toEqual(expected);
  });

  it('objects', () => {
    const filterableCollection = [
      { 'fruit-bowl': { fruit: 'apple', status: 'ripe' } },
      { 'fruit-bowl': { fruit: 'orange', status: 'rotten' } },
      { 'fruit-bowl': { fruit: 'banana', status: 'ripe' } },
      { 'fruit-bowl': { fruit: 'apple', status: 'rotten' } },
      { 'fruit-bowl': { fruit: 'banana', status: 'ripe' } },
    ];
    const filter = 'fruit-bowl';
    const expected = {
      'fruit-bowl.fruit': ['apple', 'orange', 'banana'],
      'fruit-bowl.status': ['ripe', 'rotten'],
    };
    const result = getFilterOptions(filter, filterableCollection);
    expect(result).toEqual(expected);
  });

  it('nested objects', () => {
    const filterableCollection = [
      { house: { 'fruit-bowl': { fruit: 'apple', status: 'ripe' } } },
      { house: { 'fruit-bowl': { fruit: 'orange', status: 'rotten' } } },
      { house: { 'fruit-bowl': { fruit: 'banana', status: 'ripe' } } },
      { house: { 'fruit-bowl': { fruit: 'apple', status: 'rotten' } } },
      { house: { 'fruit-bowl': { fruit: 'banana', status: 'ripe' } } },
    ];
    const filter = 'house';
    const expected = {
      'house.fruit-bowl.fruit': ['apple', 'orange', 'banana'],
      'house.fruit-bowl.status': ['ripe', 'rotten'],
    };
    const result = getFilterOptions(filter, filterableCollection);
    expect(result).toEqual(expected);
  });
});
