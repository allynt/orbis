import { fireEvent } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react-hooks';
import { useSelectionTools } from './useSelectionTools';

describe('useSelectionTools', () => {
  it('Does not return a selection layer if a key is not held', () => {
    const { result } = renderHook(() => useSelectionTools());
    expect(result.current.selectionLayer).toBeFalsy();
  });

  it('Returns a selection layer when control is held', () => {
    const { result } = renderHook(() => useSelectionTools());
    act(() => {
      fireEvent.keyDown(document, { key: 'Control' });
    });
    expect(result.current.selectionLayer).toBeTruthy();
  });

  it('Returns a selection layer when Cmd is held on Mac', () => {
    const { result } = renderHook(() => useSelectionTools());
    navigator.__defineGetter__('appVersion', () => 'MacOS');
    act(() => {
      fireEvent.keyDown(document, { metaKey: true });
    });
    expect(result.current.selectionLayer).toBeTruthy();
  });

  it('Stops returning the selection layer when control is released', () => {
    const { result } = renderHook(() =>
      useSelectionTools({ defaultIsTriggerKeyHeld: true }),
    );
    act(() => {
      fireEvent.keyUp(document, { key: 'Control' });
    });
    expect(result.current.selectionLayer).toBeFalsy();
  });

  it('Stops returning the selection layer when Cmd is released on Mac', () => {
    const { result } = renderHook(() =>
      useSelectionTools({ defaultIsTriggerKeyHeld: true }),
    );
    navigator.__defineGetter__('appVersion', () => 'MacOS');
    act(() => {
      fireEvent.keyUp(document, { metaKey: true });
    });
    expect(result.current.selectionLayer).toBeFalsy();
  });
});
