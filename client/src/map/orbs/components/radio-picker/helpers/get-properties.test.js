import { getProperties } from './get-properties';

const pairedObjects = [
  {
    name: 'Census 2011: % of people in the age band 40 - 64',
    type: 'percentage',
    property_group: '1',
  },
  {
    name: 'Census 2011: % of people in the age band 65+',
    type: 'percentage',
    property_group: '2',
  },
  {
    name: 'Census 2011: number of people in the age band 65+',
    type: 'continuous',
    property_group: '2',
  },
  {
    name: 'Census 2011: number of people in the age band 40 - 64',
    type: 'continuous',
    property_group: '1',
  },
];

const singleObjects = [
  {
    name: 'test name 1',
    type: 'percentage',
  },
  {
    name: 'test name 2',
    type: 'percentage',
  },
  {
    name: 'test name 3',
    type: 'continuous',
  },
  {
    name: 'test name 4',
    type: 'continuous',
  },
];

const mixedObjects = [
  {
    name: 'test name 1',
    type: 'percentage',
    property_group: '1',
  },
  {
    name: 'test name 2',
    type: 'continuous',
    property_group: '1',
  },
  {
    name: 'test name 3',
    type: 'continuous',
  },
  {
    name: 'test name 4',
    type: 'percentage',
  },
];

const layerTemplate = properties => {
  return {
    source_id: 'test/layer',
    metadata: {
      properties,
    },
  };
};

describe('getProperties', () => {
  it('sorts an array of `percentage` and `continuous` objects into an array of sub-arrays, each containing a percentage/number pair', () => {
    const result = getProperties(layerTemplate(pairedObjects));

    const expected = [
      [
        {
          name: 'Census 2011: % of people in the age band 40 - 64',
          type: 'percentage',
          property_group: '1',
        },
        {
          name: 'Census 2011: number of people in the age band 40 - 64',
          type: 'continuous',
          property_group: '1',
        },
      ],
      [
        {
          name: 'Census 2011: % of people in the age band 65+',
          type: 'percentage',
          property_group: '2',
        },
        {
          name: 'Census 2011: number of people in the age band 65+',
          type: 'continuous',
          property_group: '2',
        },
      ],
    ];

    expect(result).toEqual(expected);
  });

  it('returns only individual objects if no pairs present', () => {
    const result = getProperties(layerTemplate(singleObjects));

    // Will just return a duplicate array if only single objects
    const expected = singleObjects;

    expect(result).toEqual(expected);
  });

  it('returns a combination of single objects and sub-arrays, if a combination of singles/pairs are present', () => {
    const result = getProperties(layerTemplate(mixedObjects));

    const expected = [
      [
        {
          name: 'test name 1',
          type: 'percentage',
          property_group: '1',
        },
        {
          name: 'test name 2',
          type: 'continuous',
          property_group: '1',
        },
      ],
      {
        name: 'test name 3',
        type: 'continuous',
      },
      {
        name: 'test name 4',
        type: 'percentage',
      },
    ];

    expect(result).toEqual(expected);
  });
});
