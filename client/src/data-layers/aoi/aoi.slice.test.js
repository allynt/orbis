import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { waitFor } from 'test/test-utils';

import reducer, {
  startDrawingAoi,
  endDrawingAoi,
  onUnmount,
  aoiSelector,
  isDrawingAoiSelector,
  saveAoi,
} from './aoi.slice';

const mockStore = configureMockStore([thunk]);

describe('AOIs Slice', () => {
  describe('AOI Thunks', () => {
    beforeEach(() => {
      fetch.resetMocks();
    });

    describe('pending', () => {
      it('should set the saveAoi request to the request id', () => {
        const result = reducer(
          { requests: {} },
          { type: saveAoi.pending.type, meta: { requestId: 'id-123' } },
        );

        expect(result).toEqual(
          expect.objectContaining({ requests: { saveAoi: 'id-123' } }),
        );
      });
    });

    describe('fulfilled', () => {
      it(`should dispatch the ${saveAoi.fulfilled.type}`, async () => {
        fetch.once(JSON.stringify({ source_id: 'source-id-123' }));
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
          saveAoi({ name: 'Test name', description: 'Test description' }),
        );

        await waitFor(() =>
          expect(store.getActions()).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                type: saveAoi.fulfilled.type,
              }),
            ]),
          ),
        );
      });
    });

    describe('rejected', () => {
      it(`should dispatch the ${saveAoi.rejected.type} action on rejected request`, async () => {
        fetch.once(
          JSON.stringify({
            message: 'Test error message',
          }),
          {
            ok: false,
            status: 401,
            statusText: 'Test Error',
          },
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
          saveAoi({ name: 'Test name', description: 'Test description' }),
        );

        await waitFor(() =>
          expect(store.getActions()).toContainEqual(
            expect.objectContaining({
              type: saveAoi.rejected.type,
              error: expect.anything(),
            }),
          ),
        );
      });

      it('should clear the saveAoi request and set the error', () => {
        const result = reducer(
          { requests: { saveAoi: '123' } },
          {
            type: saveAoi.rejected.type,
            error: { message: 'Test message' },
          },
        );

        expect(result.requests.saveAoi).toBeUndefined();
        expect(result.error).toEqual({ message: 'Test message' });
      });

      it("should not request again if there's already a request pending", () => {
        const store = mockStore({
          accounts: {
            user: { id: 'user-id-123', customers: [{ id: 'customer-id-123' }] },
          },
          aois: {
            requests: {
              saveAoi: true,
            },
          },
        });

        store.dispatch(
          saveAoi({ name: 'Test name', description: 'Test description' }),
        );

        expect(store.getActions()).not.toContainEqual(
          expect.objectContaining({ type: saveAoi.pending.type }),
        );
      });
    });
  });

  describe('AOI Actions', () => {
    describe('startDrawingAoi', () => {
      let result;

      beforeEach(() => {
        result = reducer({ aoi: [[123, 345]] }, startDrawingAoi());
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

      beforeEach(() => {
        result = reducer({ isDrawingAoi: true }, endDrawingAoi([[123, 123]]));
      });

      it('Sets isDrawingAoi to true', () => {
        expect(result.isDrawingAoi).toBe(false);
      });

      it('Clears any existing aoi', () => {
        expect(result.aoi).toEqual([[123, 123]]);
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
  });

  describe('AOI Selectors', () => {
    it('should return undefined if the state is undefined', () => {
      const state = undefined;
      const result = aoiSelector(state);

      expect(result).toBeUndefined();
    });

    it("should get undefined for the AOI from state, when it doesn't exist", () => {
      const state = { aois: {} };
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

    it('should return undefined if the state is undefined', () => {
      const state = undefined;
      const result = isDrawingAoiSelector(state);

      expect(result).toBeUndefined();
    });

    it('should get false, for isDrawing from state', () => {
      const state = { aois: { isDrawingAoi: false } };
      const result = isDrawingAoiSelector(state);

      expect(result).toBeFalsy();
    });

    it('should get true, for isDrawing from state', () => {
      const state = { aois: { isDrawingAoi: true } };
      const result = isDrawingAoiSelector(state);

      expect(result).toBeTruthy();
    });
  });
});
