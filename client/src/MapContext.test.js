import { MapProvider, useMap } from 'MapContext';
import * as React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';

const wrapper = ({ children }) => <MapProvider>{children}</MapProvider>;

const setup = () => renderHook(() => useMap(), { wrapper });

describe('MapContext', () => {
  it('Throws an error if not wrapped with a Provider', () => {
    const { result } = renderHook(() => useMap());
    expect(result.error).toEqual(Error('Wrap your app with <MapProvider />'));
  });

  describe('toggleExtrudedMode', () => {
    it('Sets extrudedMode to true if false', () => {
      const { result } = setup();
      expect(result.current.extrudedMode).toBe(false);
      act(() => {
        result.current.toggleExtrudedMode();
      });
      expect(result.current.extrudedMode).toBe(true);
    });

    it('Sets extruded mode to false if true', () => {
      const { result } = setup();
      expect(result.current.extrudedMode).toBe(false);
      act(() => {
        result.current.toggleExtrudedMode();
      });
      expect(result.current.extrudedMode).toBe(true);
      act(() => {
        result.current.toggleExtrudedMode();
      });
      expect(result.current.extrudedMode).toBe(false);
    });

    it('Sets the view state pitch to isometric if moving from false to true', () => {
      const { result } = setup();
      act(() => {
        result.current.toggleExtrudedMode();
      });
      expect(result.current.viewState.pitch).toBe(35);
    });
  });
});
