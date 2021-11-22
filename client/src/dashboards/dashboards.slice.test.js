import fetch from 'jest-fetch-mock';

import reducer, { setWidgetData, widgetDataSelector } from './dashboards.slice';

fetch.enableMocks();

describe('Dashboards Slice', () => {
  describe('reducer', () => {
    let beforeState;
    beforeEach(() => {
      beforeState = {
        isLoading: false,
        error: null,
      };
    });

    it('returns initial state', () => {
      const actualState = reducer(undefined, {});
      expect(actualState).toEqual(expect.objectContaining(beforeState));
    });

    describe('setWidgetData', () => {
      it("builds widget data by source_id and dataset name if it doesn't exist", () => {
        const state = {},
          widgetData = {
            source_id: 'test-source',
            name: 'test-dataset-name',
            data: { name: 'this is some test data' },
          },
          expected = {
            'test-source': {
              'test-dataset-name': { name: 'this is some test data' },
            },
          };

        const result = reducer(state, setWidgetData(widgetData));
        expect(result).toEqual(expected);
      });
    });

    it('replaces widget data in state', () => {
      const state = {
          'test-source': {
            'test-dataset-name': { name: 'this is the original test data' },
          },
        },
        widgetData = {
          source_id: 'test-source',
          name: 'test-dataset-name',
          data: { name: 'this is the new test data' },
        },
        expected = {
          'test-source': {
            'test-dataset-name': { name: 'this is the new test data' },
          },
        };

      const result = reducer(state, setWidgetData(widgetData));
      expect(result).toEqual(expected);
    });
  });

  describe('selectors', () => {
    describe('widgetDataSelector', () => {
      it('selects data for a specific widget', () => {
        const state = {
            dashboards: {
              'test-source': {
                'test-dataset-name': { name: 'this is the original test data' },
              },
            },
          },
          expected = { name: 'this is the original test data' };

        const result = widgetDataSelector(
          'test-source',
          'test-dataset-name',
        )(state);
        expect(result).toEqual(expected);
      });

      it('returns undefined if no data is present', () => {
        const state = { dashboards: {} };

        const result = widgetDataSelector(
          'test-source',
          'test-dataset-name',
        )(state);
        expect(result).toBeUndefined();
      });
    });
  });
});
