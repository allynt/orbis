// @ts-nocheck

import { MAX_ZOOM } from 'map/map.constants';
import { setClickedFeatures } from '../orbReducer';
import configFn from './actionForHelpConfig';

const PERSON = {
    properties: {
      Type: 'person',
    },
  },
  INFRASTRUCTURE = {
    properties: {
      type: 'hospital',
    },
  };

const source = {
  source_id: 'test/layer',
  test: 123,
};

const setup = (activeSources = [source]) => {
  const dispatch = jest.fn();
  const setViewState = jest.fn();
  const utils = configFn({
    id: 'test/layer',
    dispatch,
    setViewState,
    activeSources,
  });
  return { ...utils, dispatch, setViewState };
};

describe('actionForHelpConfig', () => {
  describe('visible', () => {
    it('is true if activeSources includes the layer source', () => {
      const { visible } = setup();
      expect(visible).toBe(true);
    });

    it('is false if the layer source is not found in activeSources', () => {
      const { visible } = setup([{ source_id: 'not/layer' }]);
      expect(visible).toBe(false);
    });
  });

  describe('getIcon', () => {
    it('Returns the `type` property for infrastructure features', () => {
      const { getIcon } = setup();
      expect(getIcon(INFRASTRUCTURE)).toBe(INFRASTRUCTURE.properties.type);
    });

    it('Returns the `Type` property for person features', () => {
      const { getIcon } = setup();
      expect(getIcon(PERSON)).toBe(PERSON.properties.Type);
    });
  });

  describe('getIconSize', () => {
    it('Returns 15 for person features', () => {
      const { getIconSize } = setup();
      expect(getIconSize(PERSON)).toBe(15);
    });
    it('Returns 60 for other features', () => {
      const { getIconSize } = setup();
      expect(getIconSize(INFRASTRUCTURE)).toBe(60);
    });
  });

  describe('onClick', () => {
    it(`Calls setViewState if the feature is a cluster and expansion zoom is less than or equal to ${MAX_ZOOM}`, () => {
      const { onClick, setViewState } = setup();
      onClick({
        object: {
          geometry: { coordinates: [1, 2] },
          properties: { cluster: true, expansion_zoom: MAX_ZOOM - 5 },
        },
      });
      expect(setViewState).toBeCalledWith(
        expect.objectContaining({ longitude: 1, latitude: 2 }),
      );
    });

    it(`Dispatches the ${setClickedFeatures.type} action if the feature is a cluster and expansion zoom is greater than ${MAX_ZOOM}`, () => {
      const objects = ['hello', 'there'];
      const { onClick, dispatch } = setup();
      onClick({
        object: { properties: { cluster: true, expansion_zoom: MAX_ZOOM + 2 } },
        objects,
      });
      expect(dispatch).toHaveBeenCalledWith(
        setClickedFeatures(
          expect.objectContaining({ clickedFeatures: objects }),
        ),
      );
    });

    it(`Dispatches the ${setClickedFeatures.type} action if the feature is not a cluster`, () => {
      const object = { properties: { cluster: false, test: 'hello' } };
      const { onClick, dispatch } = setup();
      onClick({ object });
      expect(dispatch).toHaveBeenCalledWith(
        setClickedFeatures(
          expect.objectContaining({ clickedFeatures: [object] }),
        ),
      );
    });
  });
});
