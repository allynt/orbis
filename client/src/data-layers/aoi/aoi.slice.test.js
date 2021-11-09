import reducer, {
  startDrawingAoi,
  endDrawingAoi,
  onUnmount,
  aoiSelector,
  isDrawingAoiSelector,
} from './aoi.slice';

describe('AOIs Slice', () => {
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
