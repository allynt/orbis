import reducer, {
  setDateRange,
  setMaxDateRange,
  dateRangeSelector,
  maxDateRangeSelector,
} from './rice.slice';

describe('rice slice', () => {
  describe('reducer', () => {
    describe('setDateRange', () => {
      it('sets the dateRange in state', () => {
        const state = {};
        const payload = {
          min: new Date(1970, 0, 1),
          max: new Date(2020, 0, 1),
        };
        const result = reducer(state, setDateRange(payload));
        expect(result.dateRange).toEqual(payload);
      });
    });

    describe('setMaxDateRange', () => {
      const state = {};
      const payload = {
        min: new Date(1970, 0, 1),
        max: new Date(2020, 0, 1),
      };
      const result = reducer(state, setMaxDateRange(payload));
      expect(result.maxDateRange).toEqual(payload);
    });
  });

  describe('selectors', () => {
    describe('maxDateRangeSelector', () => {
      it('returns maxDateRange', () => {
        const state = {
          orbs: {
            rice: {
              maxDateRange: {
                min: 0,
                max: 1,
              },
            },
          },
        };
        const result = maxDateRangeSelector(state);
        expect(result).toEqual(state.orbs.rice.maxDateRange);
      });
    });

    describe('dateRangeSelector', () => {
      it('returns dateRange', () => {
        const state = {
          orbs: {
            rice: {
              dateRange: {
                min: 0,
                max: 1,
              },
            },
          },
        };
        const result = dateRangeSelector(state);
        expect(result).toEqual(state.orbs.rice.dateRange);
      });

      it('returns maxDateRange if dateRange is undefined', () => {
        const state = {
          orbs: {
            rice: {
              maxDateRange: {
                min: 0,
                max: 1,
              },
            },
          },
        };
        const result = dateRangeSelector(state);
        expect(result).toEqual(state.orbs.rice.maxDateRange);
      });
    });
  });
});
