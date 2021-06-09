import React from 'react';

import { fireEvent } from '@testing-library/dom';
import { act, renderHook as tlRenderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { setClickedFeatures } from './orbs/layers.slice';
import {
  filterAndSortPickedInfo,
  useSelectionTools,
} from './useSelectionTools';

const mockStore = configureMockStore();

const renderHook = ({ defaultIsTriggerKeyHeld = undefined } = {}) => {
  const store = mockStore();
  const utils = tlRenderHook(
    () => useSelectionTools({ defaultIsTriggerKeyHeld }),
    {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    },
  );
  return { ...utils, store };
};

describe('useSelectionTools', () => {
  it('Does not return a selection layer if a key is not held', () => {
    const { result } = renderHook();
    expect(result.current.selectionLayer).toBeFalsy();
  });

  it('Returns a selection layer when control is held', () => {
    const { result } = renderHook();
    act(() => {
      fireEvent.keyDown(document, { key: 'Control' });
    });
    expect(result.current.selectionLayer).toBeTruthy();
  });

  it('Returns a selection layer when Cmd is held on Mac', () => {
    const { result } = renderHook();
    navigator.__defineGetter__('appVersion', () => 'MacOS');
    act(() => {
      fireEvent.keyDown(document, { metaKey: true });
    });
    expect(result.current.selectionLayer).toBeTruthy();
  });

  it('Stops returning the selection layer when control is released', () => {
    const { result } = renderHook();
    act(() => {
      fireEvent.keyUp(document, { key: 'Control' });
    });
    expect(result.current.selectionLayer).toBeFalsy();
  });

  it('Stops returning the selection layer when Cmd is released on Mac', () => {
    const { result } = renderHook();
    navigator.__defineGetter__('appVersion', () => 'MacOS');
    act(() => {
      fireEvent.keyUp(document, { metaKey: true });
    });
    expect(result.current.selectionLayer).toBeFalsy();
  });

  describe('filterAndSortPickedInfo', () => {
    const info1 = {
        layer: { id: 'source/1' },
        object: {
          id: 1,
          geometry: { type: 'MultiPolygon' },
          properties: { index: 1 },
        },
      },
      info2 = {
        layer: { id: 'source/1' },
        object: {
          id: 2,
          geometry: { type: 'Point' },
          properties: { index: 2 },
        },
      },
      info3 = {
        layer: { id: 'source/2' },
        object: {
          id: 1,
          geometry: { type: 'LineString' },
          properties: { index: 3 },
        },
      },
      info4 = {
        layer: { id: 'source/2' },
        object: {
          id: 2,
          geometry: { type: 'MultiPolygon' },
          properties: { index: 4 },
        },
      };
    const pickingInfos = [info4, info2, info1, info3];

    it('Organises picked features by layer Id', () => {
      const expected = expect.objectContaining({
        'source/1': expect.anything(),
        'source/2': expect.anything(),
      });
      expect(filterAndSortPickedInfo(pickingInfos)).toEqual(expected);
    });

    it('Only includes features with Polygon like geometry', () => {
      const expected = {
        'source/1': [info1],
        'source/2': [info4],
      };
      expect(filterAndSortPickedInfo(pickingInfos)).toEqual(expected);
    });

    it('Removes features with no geometry type', () => {
      const pickingInfos = [
        { layer: { id: 'source/1' }, object: { geometry: {} } },
      ];
      const expected = {};
      expect(filterAndSortPickedInfo(pickingInfos)).toEqual(expected);
    });

    it('Supplys only unique features by property indexes', () => {
      const pickingInfos = [
        {
          id: 1,
          layer: { id: 'source/1' },
          object: { geometry: { type: 'Polygon' }, properties: { index: 1 } },
        },
        {
          id: 2,
          layer: { id: 'source/1' },
          object: { geometry: { type: 'Polygon' }, properties: { index: 1 } },
        },
      ];
      const expected = {
        'source/1': [
          {
            id: 1,
            layer: { id: 'source/1' },
            object: { geometry: { type: 'Polygon' }, properties: { index: 1 } },
          },
        ],
      };
      expect(filterAndSortPickedInfo(pickingInfos)).toEqual(expected);
    });
  });

  describe('onSelect', () => {
    const info1 = {
        layer: { id: 'source/1' },
        object: {
          id: 1,
          geometry: { type: 'MultiPolygon' },
          properties: { index: 1 },
        },
      },
      info2 = {
        layer: { id: 'source/1' },
        object: {
          id: 2,
          geometry: { type: 'Point' },
          properties: { index: 2 },
        },
      },
      info3 = {
        layer: { id: 'source/2' },
        object: {
          id: 1,
          geometry: { type: 'Point' },
          properties: { index: 3 },
        },
      },
      info4 = {
        layer: { id: 'source/2' },
        object: {
          id: 2,
          geometry: { type: 'Polygon' },
          properties: { index: 4 },
        },
      };
    const pickingInfos = [info1, info2, info3, info4];

    it(`Calls ${setClickedFeatures} with the selectedFeatures`, () => {
      const { result, store } = renderHook({ defaultIsTriggerKeyHeld: true });
      result.current.selectionLayer.props.onSelect({ pickingInfos });
      expect(store.getActions()).toContainEqual(
        expect.objectContaining({ type: setClickedFeatures.type }),
      );
    });

    it(`Calls ${setClickedFeatures} for each unique layer`, () => {
      const { result, store } = renderHook({ defaultIsTriggerKeyHeld: true });
      result.current.selectionLayer.props.onSelect({
        pickingInfos,
      });
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: setClickedFeatures.type,
            payload: expect.objectContaining({ key: 'source/1' }),
          }),
          expect.objectContaining({
            type: setClickedFeatures.type,
            payload: expect.objectContaining({ key: 'source/2' }),
          }),
        ]),
      );
    });
  });
});
