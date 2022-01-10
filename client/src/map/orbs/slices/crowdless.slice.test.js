import { rest } from 'msw';
import { server } from 'mocks/server';

import reducer, {
  setSelectedResult,
  isLoadingSelector,
  resultsSelector,
  selectedResultSelector,
  fetchResults,
  setVisibility,
  visibilitySelector,
} from './crowdless.slice';

describe('crowdless slice', () => {
  describe('actions', () => {
    describe('setSelectedResult', () => {
      it('sets the result in state', () => {
        const newResult = { properties: { placeID: 'new' } };
        // @ts-ignore
        const result = reducer({}, setSelectedResult(newResult));
        expect(result).toEqual(
          expect.objectContaining({ selectedResult: newResult }),
        );
      });
    });

    describe('setVisibility', () => {
      it('sets the visibility', () => {
        // @ts-ignore
        const result = reducer({ visible: true }, setVisibility(false));
        expect(result).toEqual(expect.objectContaining({ visible: false }));
      });

      it("sets selectedResult to undefined if it isn't", () => {
        const result = reducer(
          { selectedResult: { id: 1 } },
          setVisibility(false),
        );
        expect(result.selectedResult).toBeUndefined();
      });
    });
  });

  describe('selectors', () => {
    describe('visibilitySelector', () => {
      it('returns visible', () => {
        const state = { crowdless: { visible: true } };
        const result = visibilitySelector(state);
        expect(result).toBe(state.crowdless.visible);
      });

      it('returns false is visible is undefined', () => {
        const state = { crowdless: {} };
        const result = visibilitySelector(state);
        expect(result).toBe(false);
      });

      it('returns false if state is undefined', () => {
        const state = {};
        const result = visibilitySelector(state);
        expect(result).toBe(false);
      });
    });

    describe('isLoadingSelector', () => {
      it('returns isLoading state', () => {
        const state = { crowdless: { isLoading: true } };
        const result = isLoadingSelector(state);
        expect(result).toBe(state.crowdless.isLoading);
      });

      it('returns undefined if crowdless state is undefined', () => {
        const state = {};
        const result = isLoadingSelector(state);
        expect(result).toBeUndefined();
      });
    });

    describe('resultsSelector', () => {
      it('returns results state', () => {
        const state = { crowdless: { results: ['test', 'test2'] } };
        const result = resultsSelector(state);
        expect(result).toEqual(state.crowdless.results);
      });

      it('returns undefined if results are undefined', () => {
        const state = { crowdless: {} };
        const result = resultsSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns undefined if crowdless state is undefined', () => {
        const state = {};
        const result = resultsSelector(state);
        expect(result).toBeUndefined();
      });
    });

    describe('selectedResultSelector', () => {
      it('returns the selected result', () => {
        const state = { crowdless: { selectedResult: { id: 123 } } };
        const result = selectedResultSelector(state);
        expect(result).toEqual(state.crowdless.selectedResult);
      });

      it('returns undefined if crowdless state is undefined', () => {
        const state = {};
        const result = selectedResultSelector(state);
        expect(result).toBeUndefined();
      });
    });
  });

  describe('thunks', () => {
    describe('fetchResults', () => {
      let dispatch;

      beforeEach(() => {
        dispatch = jest.fn();
      });

      it('calls fulfilled with the response', async () => {
        const result = { features: [{ id: 1 }, { id: 2 }] };

        server.use(
          rest.get('/api', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(result));
          }),
        );

        await fetchResults({
          url: '/api',
          source: { source_id: '', metadata: { api_key: '' } },
        })(dispatch, undefined, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: fetchResults.fulfilled.type,
            payload: result,
          }),
        );
      });

      it('calls rejected if the fetch fails', async () => {
        server.use(
          rest.get('/api', (req, res, ctx) => {
            return res(ctx.status(401, 'Test Error'));
          }),
        );

        await fetchResults('/api')(dispatch, undefined, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({ type: fetchResults.rejected.type }),
        );
      });

      describe('pending', () => {
        it('sets isLoading to true', () => {
          const action = { type: fetchResults.pending.type };
          const expected = expect.objectContaining({ isLoading: true });
          const result = reducer({ isLoading: false }, action);
          expect(result).toEqual(expected);
        });
      });

      describe('fulfilled', () => {
        let action;
        beforeEach(() => {
          action = { type: fetchResults.fulfilled.type };
        });
        it('sets isLoading to false', () => {
          const expected = expect.objectContaining({ isLoading: false });
          const result = reducer({ isLoading: true }, action);
          expect(result).toEqual(expected);
        });

        it('sets results to the payload', () => {
          const payload = [{ id: 1 }, { id: 2 }];
          action = { ...action, payload };
          const expected = expect.objectContaining({ results: payload });
          const result = reducer({}, action);
          expect(result).toEqual(expected);
        });

        it('sets the selectedResult to undefined if present', () => {
          const result = reducer({ selectedResult: { id: 1 } }, action);
          expect(result.selectedResult).toBeUndefined();
        });
      });

      describe('rejected', () => {
        it('sets isLoading to false', () => {
          const action = fetchResults.rejected();
          const expected = expect.objectContaining({ isLoading: false });
          const result = reducer({ isLoading: true }, action);
          expect(result).toEqual(expected);
        });
      });
    });
  });
});
