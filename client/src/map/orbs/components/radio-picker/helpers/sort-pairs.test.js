import { sortPairs } from './sort-pairs';

const testLayer = {
  source_id: 'test/layer',
  metadata: {
    properties: [
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
    ],
  },
};

describe('sortPairs', () => {
  it('sorts an array of `percentage` and `continuous` objects into an array of sub-arrays, each containing a percentage/number pair', () => {
    const result = sortPairs(testLayer);

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
});
