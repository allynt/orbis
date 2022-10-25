import { GEOMETRY_TYPES } from './data-layers.constants';
import { getGeometryType, groupPropertiesAndSourceIds } from './utils';
const dataSources = [
  {
    properties: [
      { label: 'Test Data Source label 1' },
      { label: 'Test Data Source label 2' },
      { label: 'Test Data Source label 3' },
    ],
    source_id: 'test1',
  },
];

let properties = [{ label: 'Test Data Source label 1' }];

describe('Filter-layer-view.component', () => {
  describe('getGeometryType', () => {
    test.each`
      geometryTypes                               | expected
      ${['OA', 'LSOA', 'MSOA']}                   | ${'OA'}
      ${['OA', 'OA', 'OA', 'OA']}                 | ${'OA'}
      ${['OA']}                                   | ${'OA'}
      ${['LAD_2020', 'MSOA', 'LSOA', 'OA']}       | ${'OA'}
      ${['LAD_2020', 'MSOA', 'LSOA']}             | ${'LSOA'}
      ${['LAD_2020', 'LAD_2019']}                 | ${'LAD_2019'}
      ${['LAD_2019', 'MSOA', 'LSOA']}             | ${'LSOA'}
      ${['MSOA', 'LAD_2019', 'MSOA', 'LAD_2019']} | ${'MSOA'}
      ${['LAD_2019', 'LAD_2020']}                 | ${'LAD_2019'}
      ${['LAD_2019', 'OA', 'LAD_2020', 'LSOA']}   | ${'OA'}
      ${['LAD_2019', 'OA', 'xxx', 'LSOA']}        | ${'OA'}
    `(
      'function getGeometryType returns the highest aggregation level with array of different geometry_types_hierarchy values',
      ({ geometryTypes, expected }) => {
        expect(getGeometryType(geometryTypes, GEOMETRY_TYPES)).toBe(expected);
      },
    );

    describe('behavior with invalid data', () => {
      expect(getGeometryType(['one', 'two', 'three'], GEOMETRY_TYPES)).toBe(
        'one',
      );
    });

    describe('groupPropertiesAndSourceIds', () => {
      it('check that function selects properties by their parent source_ids', () => {
        const result = groupPropertiesAndSourceIds(properties, dataSources);
        const expected = { test1: [{ label: 'Test Data Source label 1' }] };
        expect(result).toEqual(expect.objectContaining(expected));
      });

      it('check that function returns an empty object value when properties equal to empty array', () => {
        const result = groupPropertiesAndSourceIds([], dataSources);
        const expected = {};
        expect(result).toEqual(expect.objectContaining(expected));
      });

      it('check that function returns an empty object when dataSources undefined ', () => {
        const result = groupPropertiesAndSourceIds(properties, undefined);
        const expected = {};
        expect(result).toEqual(expect.objectContaining(expected));
      });
    });
  });
});
