// @ts-nocheck

import { MAX_ZOOM } from 'map/map.constants';

import { setClickedFeatures } from '../layers.slice';
import configFn, { filterFeatures } from './actionForHelpConfig';

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
  const TEST_DATA = {
    features: [
      { properties: { 'Submission Date': '1 January 2020' } },
      { properties: { 'Submission Date': '23 October 2077' } },
      { properties: { 'Submission Date': '13 July 2258' } },
    ],
  };
  const TEST_DATA_WITH_STATUS = {
    features: [
      {
        properties: {
          'Submission Date': '1 January 2020',
          status: 'NEW',
        },
      },
      {
        properties: {
          'Submission Date': '23 October 2077',
          status: 'PENDING',
        },
      },
      {
        properties: { 'Submission Date': '13 July 2258' },
        status: 'COMPLETE',
      },
    ],
  };
  describe('filterFeatures', () => {
    it("returns all data if it's undefined", () => {
      const result = filterFeatures(undefined);
      expect(result).toBeUndefined();
    });

    it('returns all data if startDate and endDate are undefined', () => {
      const data = { features: [{ id: 1 }, { id: 2 }] };
      const result = filterFeatures(data);
      expect(result).toEqual(data);
    });

    it('returns all features after startDate if endDate is undefined', () => {
      const result = filterFeatures(TEST_DATA, new Date(2077, 9, 23));
      expect(result).toEqual({
        features: [
          { properties: { 'Submission Date': '23 October 2077' } },
          { properties: { 'Submission Date': '13 July 2258' } },
        ],
      });
    });

    it('returns all features before endDate if startDate is undefined', () => {
      const result = filterFeatures(
        TEST_DATA,
        undefined,
        new Date(2077, 9, 23),
      );
      expect(result).toEqual({
        features: [
          { properties: { 'Submission Date': '1 January 2020' } },
          { properties: { 'Submission Date': '23 October 2077' } },
        ],
      });
    });

    it('returns features filtered on Submission Date', () => {
      const data = {
        features: [
          { properties: { 'Submission Date': '1 January 2020' } },
          { properties: { 'Submission Date': '23 October 2077' } },
          { properties: { 'Submission Date': '13 July 2258' } },
        ],
      };
      const result = filterFeatures(
        data,
        new Date(2077, 9, 23),
        new Date(2077, 9, 23),
      );
      expect(result).toEqual({
        features: [{ properties: { 'Submission Date': '23 October 2077' } }],
      });
    });

    it('returns all features if status is `ALL` and no dates are provided', () => {
      const data = {
        features: [
          { properties: { status: 'NEW' } },
          { properties: { status: 'PENDING' } },
          { properties: { status: 'FOLLOWUP' } },
        ],
      };

      const result = filterFeatures(data);

      expect(result).toEqual(data);
    });

    it('filters by provided status even if no start/end dates provided', () => {
      const data = {
        features: [
          { properties: { status: 'NEW' } },
          { properties: { status: 'PENDING' } },
          { properties: { status: 'FOLLOWUP' } },
        ],
      };

      const result = filterFeatures(data, undefined, undefined, 'PENDING');

      expect(result).toEqual({
        features: [{ properties: { status: 'PENDING' } }],
      });
    });

    it('filters by status if only start date is present', () => {
      const result = filterFeatures(
        TEST_DATA_WITH_STATUS,
        new Date(2077, 9, 23),
        undefined,
        'PENDING',
      );

      expect(result).toEqual({
        features: [
          {
            properties: {
              'Submission Date': '23 October 2077',
              status: 'PENDING',
            },
          },
        ],
      });
    });

    it('filters by status if only end date is present', () => {
      const result = filterFeatures(
        TEST_DATA_WITH_STATUS,
        new Date(2077, 9, 23),
        undefined,
        'PENDING',
      );

      expect(result).toEqual({
        features: [
          {
            properties: {
              'Submission Date': '23 October 2077',
              status: 'PENDING',
            },
          },
        ],
      });
    });
  });

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
