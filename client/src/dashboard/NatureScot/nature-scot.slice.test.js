import { rest } from 'msw';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { server } from 'mocks/server';

import reducer, {
  fetchImpactActivities,
  fetchImpactAssessment,
  impactActivitiesSelector,
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

    it('should dispatch fetch impact activities failure action', async () => {
      server.use(
        rest.post(
          '*/api/proxy/data/ns/proxy/activities/latest/',
          (req, res, ctx) => {
            return res(ctx.status(401, 'Test Error'));
          },
        ),
      );

      const expectedActions = expect.arrayContaining([
        expect.objectContaining({
          type: fetchImpactActivities.rejected.type,
          payload: { message: '401 Test Error' },
        }),
      ]);

      const form = {
        description: 'Build a burn',
        startDate: '2000-01-01T00:00:00.000Z',
        endDate: '2000-02-01T00:00:00.000Z',
        activities: [{ id: 1 }, { id: 2 }],
      };

      await store.dispatch(fetchImpactActivities(form));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch impact activities success action', async () => {
      const payload = [
        {
          value: 1,
          label: 'Accumulation of organic material',
          proposed: true,
        },
        {
          value: 2,
          label: 'Physical alteration of a water body',
          proposed: false,
        },
      ];

      server.use(
        rest.post(
          '*/api/proxy/data/ns/proxy/activities/latest/',
          (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(payload));
          },
        ),
      );

      const expectedActions = expect.arrayContaining([
        expect.objectContaining({
          type: fetchImpactActivities.fulfilled.type,
          payload,
        }),
      ]);

      const form = {
        description: 'Build a burn',
        startDate: '2000-01-01T00:00:00.000Z',
        endDate: '2000-02-01T00:00:00.000Z',
        activities: [{ id: 1 }, { id: 2 }],
      };

      await store.dispatch(fetchImpactActivities(form));

      expect(store.getActions()).toEqual(expectedActions);
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

    describe('Fetch Impact Activities', () => {
      it('should update the sources in state, when failed to retrieve impact activities', () => {
        const error = { message: 'Test Impact Activities Error' };

        const actualState = reducer(beforeState, {
          type: fetchImpactActivities.rejected.type,
          payload: error,
        });

        expect(actualState.error).toEqual(error);
      });

      it('should update the sources in state, when successfully retrieved impact activities', () => {
        const payload = [
          {
            value: 1,
            label: 'Accumulation of organic material',
            proposed: true,
          },
          {
            value: 2,
            label: 'Physical alteration of a water body',
            proposed: false,
          },
        ];

        server.use(
          rest.post(
            '*/api/proxy/data/ns/proxy/activities/latest',
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json(payload));
            },
          ),
        );

        const actualState = reducer(beforeState, {
          type: fetchImpactActivities.fulfilled.type,
          payload,
        });

        expect(actualState.activities).toEqual(payload);
      });
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
    describe('Impact Activities', () => {
      it('should return an empty array if no impact activities is present', () => {
        const state = {};

        const result = impactActivitiesSelector(state);

        expect(result).toEqual([]);
      });

      it('should return an empty array if no impact activities is present', () => {
        const state = {
          natureScotDashboard: {},
        };
        const result = impactActivitiesSelector(state);

        expect(result).toEqual([]);
      });

      it('should return the impact activities results', () => {
        const state = {
          natureScotDashboard: {
            activities: [
              {
                value: 1,
                label: 'Accumulation of organic material',
                proposed: true,
              },
              {
                value: 2,
                label: 'Physical alteration of a water body',
                proposed: false,
              },
            ],
          },
        };

        const result = impactActivitiesSelector(state);

        expect(result).toBe(state.natureScotDashboard.activities);
      });
    });

    describe('Impact Assessment', () => {
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
});
