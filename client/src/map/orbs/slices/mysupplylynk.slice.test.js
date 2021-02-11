// @ts-nocheck

import reducer, {
  dialogFeaturesSelector,
  dialogVisibleSelector,
  popupFeaturesSelector,
  setDialogFeatures,
  setPopupFeatures,
  toggleDialog,
} from './mysupplylynk.slice';

describe('MySupplyLynk slice', () => {
  describe('reducer', () => {
    describe('setPopupFeatures', () => {
      it('sets popupFeatures', () => {
        const result = reducer({}, setPopupFeatures('hello'));
        expect(result.popupFeatures).toBe('hello');
      });
    });

    describe('setDialogFeatures', () => {
      it('sets dialogFeatures', () => {
        const result = reducer({}, setDialogFeatures('hello'));
        expect(result.dialogFeatures).toBe('hello');
      });
    });

    describe('toggleDialog', () => {
      it('sets dialogVisible to true if false', () => {
        const result = reducer({ dialogVisible: false }, toggleDialog());
        expect(result.dialogVisible).toBe(true);
      });

      it('sets dialogVisible to false if true', () => {
        const result = reducer({ dialogVisible: true }, toggleDialog());
        expect(result.dialogVisible).toBe(false);
      });
    });
  });

  describe('selectors', () => {
    describe('popupFeaturesSelector', () => {
      it('Returns popupFeatures from state', () => {
        const expected = [1, 2, 4];
        const state = {
          mySupplyLynk: {
            popupFeatures: expected,
          },
        };
        const result = popupFeaturesSelector(state);
        expect(result).toEqual(expected);
      });

      it('Returns undefined if popupFeatures is undefined', () => {
        const state = { mySupplyLynk: {} };
        const result = popupFeaturesSelector(state);
        expect(result).toBeUndefined();
      });

      it('Returns undefined if state is undefined', () => {
        const state = {};
        const result = popupFeaturesSelector(state);
        expect(result).toBeUndefined();
      });
    });

    describe('dialogFeaturesSelector', () => {
      it('Returns dialogFeatures from state', () => {
        const expected = [1, 2, 4];
        const state = {
          mySupplyLynk: {
            dialogFeatures: expected,
          },
        };
        const result = dialogFeaturesSelector(state);
        expect(result).toEqual(expected);
      });

      it('Returns undefined if dialogFeatures is undefined', () => {
        const state = { mySupplyLynk: {} };
        const result = dialogFeaturesSelector(state);
        expect(result).toBeUndefined();
      });

      it('Returns undefined if state is undefined', () => {
        const state = {};
        const result = dialogFeaturesSelector(state);
        expect(result).toBeUndefined();
      });
    });

    describe('dialogVisibleSelector', () => {
      it('Returns dialogVisible from state', () => {
        const state = { mySupplyLynk: { dialogVisible: true } };
        const result = dialogVisibleSelector(state);
        expect(result).toBe(true);
      });

      it('Returns false if dialogVisible is undefined', () => {
        const state = { mySupplyLynk: {} };
        const result = dialogVisibleSelector(state);
        expect(result).toBe(false);
      });

      it('Returns false if state is undefined', () => {
        const state = {};
        const result = dialogVisibleSelector(state);
        expect(result).toBe(false);
      });
    });
  });
});
