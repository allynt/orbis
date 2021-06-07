import configureMockStore from 'redux-mock-store';

import reducer, {
  toggleMissionControlDialog,
  selectIsMissionControlDialogVisible,
} from './mission-control-slice';

const mockStore = configureMockStore();

describe('Mission Control Slice', () => {
  describe('Mission Control Reducer', () => {
    let store = null;

    beforeEach(() => {
      fetch.resetMocks();

      store = mockStore({
        missionControl: {
          isMissionControlDialogVisible: false,
        },
      });
    });
  });

  describe(`${toggleMissionControlDialog}`, () => {
    it('updates `isMissionControlDialogVisible` in state', () => {
      const result = reducer({}, toggleMissionControlDialog(true));
      expect(result.isMissionControlDialogVisible).toBe(true);
    });
  });

  describe('Selectors', () => {
    describe(`${selectIsMissionControlDialogVisible}`, () => {
      it('returns `isMissionControlDialogVisible` boolean value', () => {
        const state = {
          missionControl: {
            isMissionControlDialogVisible: false,
          },
        };

        const result = selectIsMissionControlDialogVisible(state);
        expect(result).toEqual(false);
      });
    });
  });
});
