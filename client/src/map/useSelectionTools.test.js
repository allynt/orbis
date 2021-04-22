import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { act, renderHook as tlRenderHook } from '@testing-library/react-hooks';
import { useSelectionTools } from './useSelectionTools';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();

const renderHook = ({ defaultIsTriggerKeyHeld = undefined } = {}) =>
  tlRenderHook(() => useSelectionTools({ defaultIsTriggerKeyHeld }), {
    wrapper: ({ children }) => (
      <Provider store={mockStore()}>{children}</Provider>
    ),
  });

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
});
