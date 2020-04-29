import { filterValueIsPresent, areAnyFilterValuesPresent } from './filters-utils';

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
