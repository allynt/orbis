import {
  getGeometryType,
  groupPropertiesAndSourceIds,
} from './filter-layer-view.component';

let geometryTypes = [
  {
    geometry_types_hierarchy: 'OA',
  },

  {
    geometry_types_hierarchy: 'LSOA',
  },

  {
    geometry_types_hierarchy: 'LAD_2019',
  },
];

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
    it('function getGeometryType returns the highest aggregation level with array of different geometry_types_hierarchy values', () => {
      const result = getGeometryType(geometryTypes);
      const expected = {
        geometry_types_hierarchy: 'OA',
      };
      expect(result).toEqual(expected);
    });

    it('function getGeometryType returns the highest aggregation level with array of the same geometry_types_hierarchy', () => {
      const result = getGeometryType(
        (geometryTypes = [
          {
            geometry_types_hierarchy: 'LSOA',
          },

          {
            geometry_types_hierarchy: 'LSOA',
          },
        ]),
      );
      const expected = {
        geometry_types_hierarchy: 'LSOA',
      };
      expect(result).toEqual(expected);
    });

    describe('groupPropertiesAndSourceIds', () => {
      it('check that function selects properties by their parent source_ids', () => {
        const result = groupPropertiesAndSourceIds(properties, dataSources);
        const expected = { test1: [{ label: 'Test Data Source label 1' }] };
        expect(result).toEqual(expect.objectContaining(expected));
      });

      it('check that function returns an empty object value when properties equal to empty array', () => {
        const result = groupPropertiesAndSourceIds(
          (properties = []),
          dataSources,
        );
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
