import {
  getGeometryType,
  groupPropertiesAndSourceIds,
} from './data-layers-utils';

const GEOMETRY_TYPES = {
  OA: {
    order: 6,
  },
  LSOA: {
    order: 5,
  },
  MSOA: {
    order: 4,
  },
  LAD_2016: {
    order: 3,
  },
  LAD_2019: {
    order: 2,
  },
  LAD_2020: {
    order: 1,
  },
};

const DATA_SOURCES = [
  {
    metadata: {
      properties: [
        { name: 'Test Data Source name 1' },
        { name: 'Test Data Source name 2' },
        { name: 'Test Data Source name 3' },
      ],
    },
    source_id: 'test1',
  },
];

const PROPERTIES = [{ name: 'Test Data Source name 1' }];

describe('data-layers-utils', () => {
  describe('getGeometryType', () => {
    test.each`
      geometryTypes                               | expected
      ${['OA', 'LSOA', 'MSOA']}                   | ${'MSOA'}
      ${['OA', 'OA', 'OA', 'OA']}                 | ${'OA'}
      ${['OA']}                                   | ${'OA'}
      ${['LAD_2020', 'MSOA', 'LSOA', 'OA']}       | ${'LAD_2020'}
      ${['LAD_2020', 'MSOA', 'LSOA']}             | ${'LAD_2020'}
      ${['LAD_2020', 'LAD_2019']}                 | ${'LAD_2020'}
      ${['LAD_2019', 'MSOA', 'LSOA']}             | ${'LAD_2019'}
      ${['MSOA', 'LAD_2019', 'MSOA', 'LAD_2019']} | ${'LAD_2019'}
      ${['LAD_2019', 'LAD_2020']}                 | ${'LAD_2020'}
      ${['LAD_2019', 'OA', 'LAD_2020', 'LSOA']}   | ${'LAD_2020'}
      ${['LAD_2019', 'LAD_2020', 'LAD_2016']}     | ${'LAD_2020'}
      ${['LSOA', 'MSOA', 'LAD_2016']}             | ${'LAD_2016'}
    `(
      'function getGeometryType returns the highest aggregation level with array of different geometry_types_hierarchy values',
      ({ geometryTypes, expected }) => {
        expect(getGeometryType(geometryTypes, GEOMETRY_TYPES)).toBe(expected);
      },
    );

    describe('behavior with invalid data', () => {
      expect(() =>
        getGeometryType(['one', 'two', 'three'], GEOMETRY_TYPES),
      ).toThrow();
    });

    describe('groupPropertiesAndSourceIds', () => {
      it('check that function selects properties by their parent source_ids', () => {
        const result = groupPropertiesAndSourceIds(PROPERTIES, DATA_SOURCES);
        const expected = { test1: [{ name: 'Test Data Source name 1' }] };
        expect(result).toEqual(expect.objectContaining(expected));
      });
    });
  });
});
