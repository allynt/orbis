import { groupProperties } from './group-properties';

describe('groupProperties', () => {
  it('Groups properties by property_group', () => {
    const properties = [
      {
        name: 'group1/prop1',
        property_group: '1',
      },
      {
        name: 'group2/prop1',
        property_group: '2',
      },
      {
        name: 'group2/prop2',
        property_group: '2',
      },
      {
        name: 'group1/prop2',
        property_group: '1',
      },
    ];
    const expected = [
      [properties[0], properties[3]],
      [properties[1], properties[2]],
    ];
    const result = groupProperties(properties);
    expect(result).toEqual(expected);
  });

  it('returns array of properties if no groups are present', () => {
    const properties = [
      {
        name: 'test name 1',
      },
      {
        name: 'test name 2',
      },
      {
        name: 'test name 3',
      },
      {
        name: 'test name 4',
      },
    ];
    const result = groupProperties(properties);
    expect(result).toEqual(properties);
  });

  it('returns a combination of single objects and sub-arrays, if a combination of singles/pairs are present', () => {
    const properties = [
      {
        name: 'test name 1',
        property_group: '1',
      },
      {
        name: 'test name 2',
        property_group: '1',
      },
      {
        name: 'test name 3',
      },
      {
        name: 'test name 4',
      },
      {
        name: 'test name 5',
        property_group: '1',
      },
    ];
    const expected = [
      [properties[0], properties[1], properties[4]],
      properties[2],
      properties[3],
    ];
    const result = groupProperties(properties);
    expect(result).toEqual(expected);
  });
});
