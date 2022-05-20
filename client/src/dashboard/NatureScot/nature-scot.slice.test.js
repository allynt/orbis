import { addDays } from 'date-fns';
import { rest } from 'msw';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { server } from 'mocks/server';
import { waitFor } from 'test/test-utils';

import reducer, {
  fetchImpactActivities,
  fetchImpactAssessment,
  fetchProposals,
  saveProposal,
  updateProposal,
  deleteProposal,
  selectProposal,
  impactActivitiesSelector,
  impactAssessmentSelector,
  proposalsSelector,
  selectedProposalSelector,
} from './nature-scot.slice';

const mockStore = configureMockStore([thunk]);

describe('Nature Scot Slice', () => {
  describe('Thunks', () => {
    describe('Impact Assessments', () => {
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

    describe('Proposals', () => {
      let data = null;

      beforeEach(() => {
        const startDate = new Date();
        const endDate = addDays(startDate, 1);

        data = {
          id: 1,
          name: 'Test name',
          description: 'Test description',
          geometry: JSON.stringify({
            type: 'Polygon',
            coordinates: [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
              [0, 0],
            ],
          }),
          proposal_description: 'Test proposal description',
          proposal_start_date: startDate.toISOString(),
          proposal_end_date: endDate.toISOString(),
          proposal_activities: [
            {
              title: 'Activity 1',
              code: 'activity1',
            },
            {
              title: 'Activity 2',
              code: 'activity2',
            },
            {
              title: 'Activity 3',
              code: 'activity3',
            },
          ],
          report_state: JSON.stringify({
            summary: [{}],
            areas: [{}],
            impacts: [{}],
          }),
        };
      });

      describe('Fetching Proposals', () => {
        describe('fulfilled', () => {
          it(`should dispatch the ${fetchProposals.fulfilled.type} action on successful request`, async () => {
            const data = [{ id: 1 }, { id: 2 }];

            server.use(
              rest.get('*/api/proposals/', (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(data));
              }),
            );

            const store = mockStore({
              accounts: {
                user: {
                  id: 'user-id-123',
                  customers: [{ id: 'customer-id-123' }],
                },
              },
              proposals: [],
            });
            store.dispatch(fetchProposals());

            await waitFor(() =>
              expect(store.getActions()).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    type: fetchProposals.fulfilled.type,
                    payload: data,
                  }),
                ]),
              ),
            );
          });
        });

        describe('rejected', () => {
          it(`should dispatch the ${fetchProposals.rejected.type} action on rejected request`, async () => {
            server.use(
              rest.get('*/api/proposals/', (req, res, ctx) => {
                return res(ctx.status(401, 'Test Error'));
              }),
            );

            const store = mockStore({
              accounts: {
                user: {
                  id: 'user-id-123',
                  customers: [{ id: 'customer-id-123' }],
                },
              },
              proposals: [],
            });

            store.dispatch(fetchProposals());

            await waitFor(() =>
              expect(store.getActions()).toContainEqual(
                expect.objectContaining({
                  type: fetchProposals.rejected.type,
                  payload: { message: '401 Test Error' },
                  error: expect.anything(),
                }),
              ),
            );
          });
        });
      });

      describe('Saving Proposal', () => {
        describe('fulfilled', () => {
          it(`should dispatch the ${saveProposal.fulfilled.type}`, async () => {
            server.use(
              rest.post('*/api/proposals/', (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(data));
              }),
            );

            const store = mockStore({
              accounts: {
                user: {
                  id: 'user-id-123',
                  customers: [{ id: 'customer-id-123' }],
                },
              },
              proposals: [],
            });
            store.dispatch(saveProposal(data));

            await waitFor(() =>
              expect(store.getActions()).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    type: saveProposal.fulfilled.type,
                    payload: data,
                  }),
                ]),
              ),
            );
          });
        });

        describe('rejected', () => {
          it(`should dispatch the ${saveProposal.rejected.type} action on rejected request`, async () => {
            server.use(
              rest.post('*/api/proposals/', (req, res, ctx) => {
                return res(ctx.status(401, 'Test Error'));
              }),
            );

            const store = mockStore({
              accounts: {
                user: {
                  id: 'user-id-123',
                  customers: [{ id: 'customer-id-123' }],
                },
              },
              proposals: [],
            });

            store.dispatch(saveProposal(data));

            await waitFor(() =>
              expect(store.getActions()).toContainEqual(
                expect.objectContaining({
                  type: saveProposal.rejected.type,
                  payload: { message: '401 Test Error' },
                  error: expect.anything(),
                }),
              ),
            );
          });
        });
      });

      describe('Update Proposal', () => {
        describe('fulfilled', () => {
          it(`should dispatch the ${updateProposal.fulfilled.type}`, async () => {
            server.use(
              rest.put('*/api/proposals/:proposalId/', (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(data));
              }),
            );

            const store = mockStore({
              accounts: {
                user: {
                  id: 'user-id-123',
                  customers: [{ id: 'customer-id-123' }],
                },
              },
              proposals: [
                { ...data, name: 'Old Test Name' },
                {
                  id: 2,
                  name: 'Another Test Name',
                  description: 'Another Test Description',
                },
              ],
            });
            store.dispatch(updateProposal(data));

            await waitFor(() =>
              expect(store.getActions()).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    type: updateProposal.fulfilled.type,
                    payload: data,
                  }),
                ]),
              ),
            );
          });
        });

        describe('rejected', () => {
          it(`should dispatch the ${updateProposal.rejected.type} action on rejected request`, async () => {
            server.use(
              rest.put('*/api/proposals/:proposalId/', (req, res, ctx) => {
                return res(ctx.status(401, 'Test Error'));
              }),
            );

            const store = mockStore({
              accounts: {
                user: {
                  id: 'user-id-123',
                  customers: [{ id: 'customer-id-123' }],
                },
              },
              proposals: [
                {
                  id: 1,
                  name: 'Old Test Name',
                  description: 'Test Description',
                },
                {
                  id: 2,
                  name: 'Another Test Name',
                  description: 'Another Test Description',
                },
              ],
            });

            store.dispatch(updateProposal(data));

            await waitFor(() =>
              expect(store.getActions()).toContainEqual(
                expect.objectContaining({
                  type: updateProposal.rejected.type,
                  payload: { message: '401 Test Error' },
                  error: expect.anything(),
                }),
              ),
            );
          });
        });
      });

      describe('Delete Proposal', () => {
        describe('fulfilled', () => {
          it(`should dispatch the ${deleteProposal.fulfilled.type}`, async () => {
            server.use(
              rest.delete('*/api/proposals/:proposalId/', (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(data));
              }),
            );

            const store = mockStore({
              accounts: {
                user: {
                  id: 'user-id-123',
                  customers: [{ id: 'customer-id-123' }],
                },
              },
              proposals: {},
            });
            store.dispatch(deleteProposal(data));

            await waitFor(() =>
              expect(store.getActions()).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    type: deleteProposal.fulfilled.type,
                    payload: data,
                  }),
                ]),
              ),
            );
          });
        });

        describe('rejected', () => {
          it(`should dispatch the ${deleteProposal.rejected.type} action on rejected request`, async () => {
            server.use(
              rest.delete('*/api/proposals/:proposalId/', (req, res, ctx) => {
                return res(ctx.status(401, 'Test Error'));
              }),
            );

            const store = mockStore({
              accounts: {
                user: {
                  id: 'user-id-123',
                  customers: [{ id: 'customer-id-123' }],
                },
              },
              proposals: {},
            });

            store.dispatch(deleteProposal(data));

            await waitFor(() =>
              expect(store.getActions()).toContainEqual(
                expect.objectContaining({
                  type: deleteProposal.rejected.type,
                  payload: { message: '401 Test Error' },
                  error: expect.anything(),
                }),
              ),
            );
          });
        });
      });
    });
  });

  describe('Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        isLoading: false,
        error: null,
        impactAssessment: null,
        proposals: null,
        selectedProposal: null,
      };
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});

      expect(actualState).toEqual(expect.objectContaining(beforeState));
    });

    // TODO: actions tests
    describe('setSelectedProposal', () => {});

    describe('clearImpactAssessment', () => {});

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

    describe('Fetch Proposals', () => {
      it('should update list of saved Proposals, when fetch successful', () => {
        const proposals = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

        const actualState = reducer(beforeState, {
          type: fetchProposals.fulfilled.type,
          payload: proposals,
        });

        expect(actualState.proposals).toEqual(proposals);
        expect(actualState.error).toBeNull();
      });

      it('should set error state, when fetch unsuccessful', () => {
        const errorMessage = 'I am an error message';

        const actualState = reducer(beforeState, {
          type: fetchProposals.rejected.type,
          payload: errorMessage,
        });

        expect(actualState.proposals).toBeNull();
        expect(actualState.error).toEqual(errorMessage);
      });
    });

    describe('Save Proposal', () => {
      it('should add Proposal to list of saved Proposals, when save successful', () => {
        const proposal = { id: 5 };

        const actualState = reducer(beforeState, {
          type: saveProposal.fulfilled.type,
          payload: proposal,
        });

        expect(actualState.proposals).toEqual([proposal]);
        expect(actualState.error).toBeNull();
      });

      it('should set error state, when save Proposal unsuccessful', () => {
        const errorMessage = 'I am an error message';

        const actualState = reducer(beforeState, {
          type: saveProposal.rejected.type,
          payload: errorMessage,
        });

        expect(actualState.proposals).toBeNull();
        expect(actualState.error).toEqual(errorMessage);
      });
    });

    describe('Update Proposal', () => {
      it('should update Proposal in list of saved Proposals, when update successful', () => {
        beforeState.proposals = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const updatedProposal = {
          ...beforeState.proposals[1],
          name: 'Test Name',
        };

        const actualState = reducer(beforeState, {
          type: updateProposal.fulfilled.type,
          payload: updatedProposal,
        });

        expect(actualState.proposals).toEqual([
          beforeState.proposals[0],
          updatedProposal,
          beforeState.proposals[2],
        ]);
        expect(actualState.error).toBeNull();
      });

      it('should set error state, when update Proposal unsuccessful', () => {
        const errorMessage = 'I am an error message';

        const actualState = reducer(beforeState, {
          type: updateProposal.rejected.type,
          payload: errorMessage,
        });

        expect(actualState.proposals).toBeNull();
        expect(actualState.error).toEqual(errorMessage);
      });
    });

    describe('Delete Proposal', () => {
      it('should delete an Proposal in list of saved Proposals, when delete successful', () => {
        beforeState.proposals = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const deletedProposal = beforeState.proposals[1];

        const actualState = reducer(beforeState, {
          type: deleteProposal.fulfilled.type,
          payload: deletedProposal,
        });

        expect(actualState.proposals).toEqual([
          beforeState.proposals[0],
          beforeState.proposals[2],
        ]);
        expect(actualState.error).toBeNull();
      });

      it('should set error state, when delete Proposal unsuccessful', () => {
        const errorMessage = 'I am an error message';

        const actualState = reducer(beforeState, {
          type: deleteProposal.rejected.type,
          payload: errorMessage,
        });

        expect(actualState.proposals).toBeNull();
        expect(actualState.error).toEqual(errorMessage);
      });
    });

    describe('Select Proposal', () => {
      it('should set loading to true, when select `PENDING`', () => {
        const actualState = reducer(beforeState, {
          type: selectProposal.pending.type,
        });

        expect(actualState.isLoading).toBe(true);
      });

      it('should set loading to false, when select `FULFILLED`', () => {
        const actualState = reducer(beforeState, {
          type: selectProposal.fulfilled.type,
        });

        expect(actualState.isLoading).toBe(false);
      });

      it('should set loading to true, when select `REJECTED`', () => {
        const actualState = reducer(beforeState, {
          type: selectProposal.rejected.type,
        });

        expect(actualState.isLoading).toBe(false);
      });
    });
  });

  describe('Selectors', () => {
    let proposal = null;

    beforeEach(() => {
      const startDate = new Date();
      const endDate = addDays(startDate, 1);

      proposal = {
        id: 1,
        name: 'Test name',
        description: 'Test description',
        geometry: JSON.stringify({
          type: 'Polygon',
          coordinates: [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        }),
        proposal_description: 'Test proposal description',
        proposal_start_date: startDate.toISOString(),
        proposal_end_date: endDate.toISOString(),
        proposal_activities: [
          {
            title: 'Activity 1',
            code: 'activity1',
          },
          {
            title: 'Activity 2',
            code: 'activity2',
          },
          {
            title: 'Activity 3',
            code: 'activity3',
          },
        ],
        report_state: JSON.stringify({
          summary: [{}],
          areas: [{}],
          impacts: [{}],
        }),
      };
    });

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

    describe('Proposals Selector', () => {
      it('should return undefined if the state is undefined', () => {
        const state = undefined;
        const result = proposalsSelector(state);

        expect(result).toBeUndefined();
      });

      it("should get undefined for the Proposals from state, when it doesn't exist", () => {
        const state = { natureScotDashboard: {} };
        const result = proposalsSelector(state);

        expect(result).toBeUndefined();
      });

      it('should get null when no saved proposals exist', () => {
        const state = { natureScotDashboard: { proposals: null } };
        const result = proposalsSelector(state);

        expect(result).toBeNull();
      });

      it('should get the Proposals from state, when it exists', () => {
        const state = { natureScotDashboard: { proposals: [proposal] } };
        const result = proposalsSelector(state);

        expect(result).toEqual([proposal]);
      });
    });

    describe('Selected Proposal Selector', () => {
      it('should return undefined if the state is undefined', () => {
        const state = undefined;
        const result = selectedProposalSelector(state);

        expect(result).toBeUndefined();
      });

      it('should return null if there is no Proposal selected', () => {
        const state = { natureScotDashboard: { selectedProposal: null } };
        const result = selectedProposalSelector(state);

        expect(result).toBeNull();
      });

      it('should return the Proposal selected', () => {
        const state = { natureScotDashboard: { selectedProposal: proposal } };
        const result = selectedProposalSelector(state);

        expect(result).toEqual(proposal);
      });
    });
  });
});
