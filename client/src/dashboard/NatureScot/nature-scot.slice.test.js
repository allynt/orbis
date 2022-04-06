import { rest } from 'msw';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { server } from 'mocks/server';

import reducer, {
  fetchImpactAssessment,
  impactAssessmentSelector,
} from './nature-scot.slice';

const mockStore = configureMockStore([thunk]);

describe('Nature Scot Slice', () => {
  describe('Thunks', () => {
    let store = null;

    beforeEach(() => {
      store = mockStore({
        data: { tokens: { 'ns/proxy/impact/latest': 'test-token' } },
      });
    });

    it('should dispatch fetch impact assessment failure action', async () => {
      server.use(
        rest.post(
          '*/api/proxy/data/ns/proxy/impact/latest/',
          (req, res, ctx) => {
            return res(ctx.status(401, 'Test Error'));
          },
        ),
      );

      const expectedActions = expect.arrayContaining([
        expect.objectContaining({
          type: fetchImpactAssessment.rejected.type,
          payload: { message: '401 Test Error' },
        }),
      ]);

      const form = {
        description: 'Build a burn',
        startDate: '2000-01-01T00:00:00.000Z',
        endDate: '2000-02-01T00:00:00.000Z',
        activities: [{ id: 1 }, { id: 2 }],
      };

      await store.dispatch(fetchImpactAssessment(form));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch impact assessment success action', async () => {
      const payload = {
        summary: [],
        areas: [],
        impacts: [],
      };

      server.use(
        rest.post(
          '*/api/proxy/data/ns/proxy/impact/latest/',
          (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(payload));
          },
        ),
      );

      const expectedActions = expect.arrayContaining([
        expect.objectContaining({
          type: fetchImpactAssessment.fulfilled.type,
          payload,
        }),
      ]);

      const form = {
        description: 'Build a burn',
        startDate: '2000-01-01T00:00:00.000Z',
        endDate: '2000-02-01T00:00:00.000Z',
        activities: [{ id: 1 }, { id: 2 }],
      };

      await store.dispatch(fetchImpactAssessment(form));

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        isLoading: false,
        error: null,
        impactAssessment: null,
      };
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});

      expect(actualState).toEqual(expect.objectContaining(beforeState));
    });

    describe('Fetch Impact Assessment', () => {
      it('should update the sources in state, when failed to retrieve impact assessment', () => {
        const error = { message: 'Test Impact Assessment Error' };

        const actualState = reducer(beforeState, {
          type: fetchImpactAssessment.rejected.type,
          payload: error,
        });

        expect(actualState.error).toEqual(error);
      });

      it('should update the sources in state, when successfully retrieved impact assessment', () => {
        const payload = {
          natureScotDashboard: {
            impactAssessment: {
              summary: [],
              areas: [],
              impacts: [],
            },
          },
        };

        const actualState = reducer(beforeState, {
          type: fetchImpactAssessment.fulfilled.type,
          payload,
        });

        expect(actualState.impactAssessment).toEqual(payload);
      });
    });
  });

  describe('Selectors', () => {
    it('should return null if no impact assessment is present', () => {
      const state = {};

      const result = impactAssessmentSelector(state);

      expect(result).toBeNull();
    });

    it('should return null if no impact assessment is present', () => {
      const state = {
        natureScotDashboard: {},
      };
      const result = impactAssessmentSelector(state);

      expect(result).toBeNull();
    });

    it('should return the impact assessment results', () => {
      const state = {
        natureScotDashboard: {
          impactAssessment: {
            summary: [],
            areas: [],
            impacts: [],
          },
        },
      };

      const result = impactAssessmentSelector(state);

      expect(result).toBe(state.natureScotDashboard.impactAssessment);
    });
  });
});
