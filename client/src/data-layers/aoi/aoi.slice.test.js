import { rest } from 'msw';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { server } from 'mocks/server';
import { waitFor } from 'test/test-utils';

import { Panels } from '../data-layers.constants';
import reducer, {
  fetchAois,
  saveAoi,
  updateAoi,
  deleteAoi,
  selectAoi,
  startDrawingAoi,
  setAoiFeatures,
  endDrawingAoi,
  onUnmount,
  setVisiblePanel,
  setSelectedAoi,
  aoiSelector,
  aoiListSelector,
  isDrawingAoiSelector,
  visiblePanelSelector,
  selectedAoiSelector,
} from './aoi.slice';

const mockStore = configureMockStore([thunk]);

const FEATURE_COLLECTION = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [123, 123],
          [125, 125],
        ],
      },
    },
  ],
};

describe('AOIs Slice', () => {
  describe('AOI Thunks', () => {
    describe('Fetching AOIs', () => {
      describe('fulfilled', () => {
        it(`should dispatch the ${fetchAois.fulfilled.type} action on successful request`, async () => {
          const data = [{ id: 1 }, { id: 2 }];

          server.use(
            rest.get('*/api/aois/', (req, res, ctx) => {
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
            aois: [],
          });
          store.dispatch(fetchAois());

          await waitFor(() =>
            expect(store.getActions()).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  type: fetchAois.fulfilled.type,
                  payload: data,
                }),
              ]),
            ),
          );
        });
      });

      describe('rejected', () => {
        it(`should dispatch the ${fetchAois.rejected.type} action on rejected request`, async () => {
          server.use(
            rest.get('*/api/aois/', (req, res, ctx) => {
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
            aois: [],
          });

          store.dispatch(fetchAois());

          await waitFor(() =>
            expect(store.getActions()).toContainEqual(
              expect.objectContaining({
                type: fetchAois.rejected.type,
                payload: { message: '401 Test Error' },
                error: expect.anything(),
              }),
            ),
          );
        });
      });
    });

    describe('Saving AOI', () => {
      describe('fulfilled', () => {
        it(`should dispatch the ${saveAoi.fulfilled.type}`, async () => {
          const data = { name: 'Test name', description: 'Test description' };

          server.use(
            rest.post('*/api/aois/', (req, res, ctx) => {
              return res(
                ctx.status(200),
                ctx.json({
                  id: 1,
                  ...data,
                }),
              );
            }),
          );

          const store = mockStore({
            accounts: {
              user: {
                id: 'user-id-123',
                customers: [{ id: 'customer-id-123' }],
              },
            },
            aois: [],
          });
          store.dispatch(saveAoi(data));

          await waitFor(() =>
            expect(store.getActions()).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  type: saveAoi.fulfilled.type,
                  payload: { id: 1, ...data },
                }),
              ]),
            ),
          );
        });
      });

      describe('rejected', () => {
        it(`should dispatch the ${saveAoi.rejected.type} action on rejected request`, async () => {
          server.use(
            rest.post('*/api/aois/', (req, res, ctx) => {
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
            aois: [],
          });

          store.dispatch(
            saveAoi({ name: 'Test name', description: 'Test description' }),
          );

          await waitFor(() =>
            expect(store.getActions()).toContainEqual(
              expect.objectContaining({
                type: saveAoi.rejected.type,
                payload: { message: '401 Test Error' },
                error: expect.anything(),
              }),
            ),
          );
        });
      });
    });

    describe('Update AOI', () => {
      describe('fulfilled', () => {
        it(`should dispatch the ${updateAoi.fulfilled.type}`, async () => {
          const data = {
            id: 1,
            name: 'Test name',
            description: 'Test description',
          };

          server.use(
            rest.put('*/api/aois/:aoiId/', (req, res, ctx) => {
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
            aois: [
              { ...data, name: 'Old Test Name' },
              {
                id: 2,
                name: 'Another Test Name',
                description: 'Another Test Description',
              },
            ],
          });
          store.dispatch(updateAoi(data));

          await waitFor(() =>
            expect(store.getActions()).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  type: updateAoi.fulfilled.type,
                  payload: { ...data },
                }),
              ]),
            ),
          );
        });
      });

      describe('rejected', () => {
        it(`should dispatch the ${updateAoi.rejected.type} action on rejected request`, async () => {
          server.use(
            rest.put('*/api/aois/:aoiId/', (req, res, ctx) => {
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
            aois: [
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

          store.dispatch(
            updateAoi({
              id: 1,
              name: 'New Test name',
              description: 'Test description',
            }),
          );

          await waitFor(() =>
            expect(store.getActions()).toContainEqual(
              expect.objectContaining({
                type: updateAoi.rejected.type,
                payload: { message: '401 Test Error' },
                error: expect.anything(),
              }),
            ),
          );
        });
      });
    });

    describe('Delete AOI', () => {
      describe('fulfilled', () => {
        it(`should dispatch the ${deleteAoi.fulfilled.type}`, async () => {
          const data = {
            id: 1,
            name: 'Test name',
            description: 'Test description',
          };

          server.use(
            rest.delete('*/api/aois/:aoiId/', (req, res, ctx) => {
              return res(
                ctx.status(200),
                ctx.json({
                  id: 1,
                  ...data,
                }),
              );
            }),
          );

          const store = mockStore({
            accounts: {
              user: {
                id: 'user-id-123',
                customers: [{ id: 'customer-id-123' }],
              },
            },
            aois: {},
          });
          store.dispatch(deleteAoi(data));

          await waitFor(() =>
            expect(store.getActions()).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  type: deleteAoi.fulfilled.type,
                  payload: { id: 1, ...data },
                }),
              ]),
            ),
          );
        });
      });

      describe('rejected', () => {
        it(`should dispatch the ${deleteAoi.rejected.type} action on rejected request`, async () => {
          server.use(
            rest.delete('*/api/aois/:aoiId/', (req, res, ctx) => {
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
            aois: {},
          });

          store.dispatch(
            deleteAoi({
              id: 1,
              name: 'Test name',
              description: 'Test description',
            }),
          );

          await waitFor(() =>
            expect(store.getActions()).toContainEqual(
              expect.objectContaining({
                type: deleteAoi.rejected.type,
                payload: { message: '401 Test Error' },
                error: expect.anything(),
              }),
            ),
          );
        });
      });
    });
  });

  describe('AOI Reducers', () => {
    describe('startDrawingAoi', () => {
      let result;

      beforeEach(() => {
        result = reducer({ isDrawing: false }, startDrawingAoi());
      });

      it('Sets isDrawingAoi to true', () => {
        expect(result.isDrawingAoi).toBe(true);
      });

      it('Clears any existing aoi', () => {
        expect(result.aoi).toBeUndefined();
      });
    });

    describe('endDrawingAoi', () => {
      let result;
      let featureCollection;

      beforeEach(() => {
        featureCollection = FEATURE_COLLECTION;
      });

      it("Sets isDrawingAoi to false, but doesn't set AOI", () => {
        result = reducer({ isDrawingAoi: true }, endDrawingAoi({ tipe: '' }));

        expect(result.isDrawingAoi).toBe(false);
        expect(result.aoi).toBeUndefined();
      });

      it('Sets isDrawingAoi to false, and AOI to feature', () => {
        result = reducer(
          { isDrawingAoi: true },
          endDrawingAoi(featureCollection),
        );

        expect(result.isDrawingAoi).toBe(false);
        expect(result.aoi).toEqual(featureCollection.features[0]);
      });
    });

    describe('setAoiFeatures', () => {
      let result;
      let featureCollection;

      beforeEach(() => {
        featureCollection = FEATURE_COLLECTION;
      });

      it("Doesn't set AOI feature when `type` doesn't exist in payload", () => {
        result = reducer(
          { isDrawingAoi: true },
          setAoiFeatures(featureCollection.features[0].geometry.coordinates),
        );

        expect(result.aoi).toBeUndefined();
      });

      it('Sets AOI feature when `type` exists in payload', () => {
        result = reducer(
          { isDrawingAoi: true },
          setAoiFeatures(featureCollection),
        );

        expect(result.aoi).toEqual(featureCollection.features[0]);
      });
    });

    describe('onUnmount', () => {
      let result;

      beforeAll(() => {
        result = reducer({ isDrawingAoi: true }, onUnmount());
      });

      it('sets isDrawingAoi to false', () => {
        expect(result.isDrawingAoi).toBe(false);
      });
    });

    describe('setVisiblePanel', () => {
      let result;

      it('sets visible panel to AOI tab', () => {
        result = reducer(
          { visiblePanel: Panels.DATA_LAYERS },
          setVisiblePanel(Panels.AOI),
        );

        expect(result.visiblePanel).toEqual('AOI');
      });

      it('sets visible panel to Data Layers tab', () => {
        result = reducer(
          { visiblePanel: Panels.AOI },
          setVisiblePanel(Panels.DATA_LAYERS),
        );

        expect(result.visiblePanel).toEqual('Data Layers');
      });
    });

    describe('setSelectedAoi', () => {
      let result;
      let aoi;

      beforeEach(() => {
        aoi = {
          id: 1,
          name: 'Selected AOI',
          description: 'Selected AOI Description',
        };

        result = reducer({ selectedAoi: null }, setSelectedAoi(aoi));
      });

      it('sets selected AOI to payload', () => {
        expect(result.selectedAoi).toEqual(aoi);
      });
    });
  });

  describe('AOI Extra Reducers', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        selectedAoi: null,
        aois: null,
        error: null,
        isLoading: false,
        isDrawingAoi: false,
        visiblePanel: Panels.DATA_LAYERS,
      };
    });

    describe('Fetch AOIs', () => {
      it('should update list of saved AOIs, when fetch successful', () => {
        const aois = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

        const actualState = reducer(beforeState, {
          type: fetchAois.fulfilled.type,
          payload: aois,
        });

        expect(actualState.aois).toEqual(aois);
        expect(actualState.error).toBeNull();
      });

      it('should set error state, when fetch unsuccessful', () => {
        const errorMessage = 'I am an error message';

        const actualState = reducer(beforeState, {
          type: fetchAois.rejected.type,
          payload: errorMessage,
        });

        expect(actualState.aois).toBeNull();
        expect(actualState.error).toEqual(errorMessage);
      });
    });

    describe('Save AOI', () => {
      it('should add AOI to list of saved AOIs, when save successful', () => {
        const aoi = { id: 5 };

        const actualState = reducer(beforeState, {
          type: saveAoi.fulfilled.type,
          payload: aoi,
        });

        expect(actualState.aois).toEqual([aoi]);
        expect(actualState.error).toBeNull();
      });

      it('should set error state, when save AOI unsuccessful', () => {
        const errorMessage = 'I am an error message';

        const actualState = reducer(beforeState, {
          type: saveAoi.rejected.type,
          payload: errorMessage,
        });

        expect(actualState.aois).toBeNull();
        expect(actualState.error).toEqual(errorMessage);
      });
    });

    describe('Update AOI', () => {
      it('should update AOI in list of saved AOIs, when update successful', () => {
        beforeState.aois = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const updatedAoi = { ...beforeState.aois[1], name: 'Test Name' };

        const actualState = reducer(beforeState, {
          type: updateAoi.fulfilled.type,
          payload: updatedAoi,
        });

        expect(actualState.aois).toEqual([
          beforeState.aois[0],
          updatedAoi,
          beforeState.aois[2],
        ]);
        expect(actualState.error).toBeNull();
      });

      it('should set error state, when update AOI unsuccessful', () => {
        const errorMessage = 'I am an error message';

        const actualState = reducer(beforeState, {
          type: updateAoi.rejected.type,
          payload: errorMessage,
        });

        expect(actualState.aois).toBeNull();
        expect(actualState.error).toEqual(errorMessage);
      });
    });

    describe('Delete AOI', () => {
      it('should delete an AOI in list of saved AOIs, when delete successful', () => {
        beforeState.aois = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const deletedAoi = beforeState.aois[1];

        const actualState = reducer(beforeState, {
          type: deleteAoi.fulfilled.type,
          payload: deletedAoi,
        });

        expect(actualState.aois).toEqual([
          beforeState.aois[0],
          beforeState.aois[2],
        ]);
        expect(actualState.error).toBeNull();
      });

      it('should set error state, when delete AOI unsuccessful', () => {
        const errorMessage = 'I am an error message';

        const actualState = reducer(beforeState, {
          type: deleteAoi.rejected.type,
          payload: errorMessage,
        });

        expect(actualState.aois).toBeNull();
        expect(actualState.error).toEqual(errorMessage);
      });
    });

    describe('Select AOI', () => {
      it('should set loading to true, when select `PENDING`', () => {
        const actualState = reducer(beforeState, {
          type: selectAoi.pending.type,
        });

        expect(actualState.isLoading).toBe(true);
      });

      it('should set loading to false, when select `FULFILLED`', () => {
        const actualState = reducer(beforeState, {
          type: selectAoi.fulfilled.type,
        });

        expect(actualState.isLoading).toBe(false);
      });

      it('should set loading to true, when select `REJECTED`', () => {
        const actualState = reducer(beforeState, {
          type: selectAoi.rejected.type,
        });

        expect(actualState.isLoading).toBe(false);
      });
    });
  });

  describe('AOI Selectors', () => {
    describe('AOI Selector', () => {
      it('should return undefined if the state is undefined', () => {
        const state = undefined;
        const result = aoiSelector(state);

        expect(result).toBeUndefined();
      });

      it("should get undefined for the AOI from state, when it doesn't exist", () => {
        const state = { aois: [] };
        const result = aoiSelector(state);

        expect(result).toBeUndefined();
      });

      it('should get the AOI from state, when it exists', () => {
        const aoi = [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
        ];
        const state = { aois: { aoi } };
        const result = aoiSelector(state);

        expect(result).toEqual(aoi);
      });
    });

    describe('AOI List Selector', () => {
      it('should return undefined if the state is undefined', () => {
        const state = undefined;
        const result = aoiListSelector(state);

        expect(result).toBeUndefined();
      });

      it('should get null when no saved AOIs exist', () => {
        const state = { aois: { aois: null } };
        const result = aoiListSelector(state);

        expect(result).toBeNull();
      });

      it('should get a list of AOIs from state, when they exist', () => {
        const aois = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
        const state = { aois: { aois } };
        const result = aoiListSelector(state);

        expect(result).toEqual(aois);
      });
    });

    describe('Is Drawing AOI Selector', () => {
      it('should return undefined if the state is undefined', () => {
        const state = undefined;
        const result = isDrawingAoiSelector(state);

        expect(result).toBeUndefined();
      });

      it('should get false when not drawing AOI', () => {
        const state = { aois: { isDrawingAoi: false } };
        const result = isDrawingAoiSelector(state);

        expect(result).toBeFalsy();
      });

      it('should get true when not drawing AOI', () => {
        const state = { aois: { isDrawingAoi: true } };
        const result = isDrawingAoiSelector(state);

        expect(result).toBeTruthy();
      });
    });

    describe('Visible Panel Selector', () => {
      it('should return undefined if the state is undefined', () => {
        const state = undefined;
        const result = visiblePanelSelector(state);

        expect(result).toBeUndefined();
      });

      it('should get `Layers` panel by default', () => {
        const state = { aois: { visiblePanel: Panels.DATA_LAYERS } };
        const result = visiblePanelSelector(state);

        expect(result).toEqual('Data Layers');
      });

      it('should get `AOI` panel when tab clicked', () => {
        const state = { aois: { visiblePanel: Panels.AOI } };
        const result = visiblePanelSelector(state);

        expect(result).toEqual('AOI');
      });
    });

    describe('Selected AOI Selector', () => {
      it('should return undefined if the state is undefined', () => {
        const state = undefined;
        const result = selectedAoiSelector(state);

        expect(result).toBeUndefined();
      });

      it('should return null if there is no AOI selected', () => {
        const state = { aois: { selectedAoi: null } };
        const result = selectedAoiSelector(state);

        expect(result).toBeNull();
      });

      it('should return the AOI selected', () => {
        const selectedAoi = {
          id: 1,
          name: 'Selected AOI',
          description: 'Selected AOI Description',
        };

        const state = { aois: { selectedAoi } };
        const result = selectedAoiSelector(state);

        expect(result).toEqual(selectedAoi);
      });
    });
  });
});
