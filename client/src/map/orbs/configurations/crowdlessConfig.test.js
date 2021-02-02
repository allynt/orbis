// @ts-nocheck

import { setSelectedResult } from '../slices/crowdless.slice';
import configFn from './crowdlessConfig';

const setup = state => {
  const dispatch = jest.fn();
  const fns = configFn({
    id: 'test/layer',
    dispatch,
    orbState: { crowdless: state },
  });
  return { ...fns, dispatch };
};

describe('crowdlessConfig', () => {
  const feature = {
    geometry: {
      coordinates: [1, 2],
    },
    properties: {
      placeId: '123',
      crowdednessCategory: 'hello',
    },
  };
  describe('getPosition', () => {
    it('returns the features coordinates', () => {
      const { getPosition } = setup();
      expect(getPosition(feature)).toEqual(feature.geometry.coordinates);
    });
  });

  describe('getIcon', () => {
    it('returns the features crowdednessCategory', () => {
      const { getIcon } = setup();
      expect(getIcon(feature)).toBe(feature.properties.crowdednessCategory);
    });

    it('appends -selected if the feature is selected', () => {
      const { getIcon } = setup({ selectedResult: feature });
      expect(getIcon(feature)).toBe(
        `${feature.properties.crowdednessCategory}-selected`,
      );
    });
  });

  describe('getSize', () => {
    it(`returns ${60 * 1.4} if the feature is selected`, () => {
      const { getSize } = setup({ selectedResult: feature });
      expect(getSize(feature)).toBe(60 * 1.4);
    });

    it("Returns 60 if the feature isn't selected", () => {
      const { getSize } = setup();
      expect(getSize(feature)).toBe(60);
    });
  });

  describe('onClick', () => {
    it(`Dispatches the ${setSelectedResult.type} action with the clicked feature`, () => {
      const { onClick, dispatch } = setup();
      onClick({ object: feature });
      expect(dispatch).toHaveBeenCalledWith(setSelectedResult(feature));
    });
  });
});
