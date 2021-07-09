import React from 'react';

import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { renderHook } from '@testing-library/react-hooks';

import { SatellitesProvider, useSatellites } from './satellites-context';

/**
 * @param {Omit<import('./satellites-context').SatellitesProviderProps, 'children'>} [props]
 */
const renderContext = props =>
  renderHook(() => useSatellites(), {
    wrapper: ({ children }) => (
      <SatellitesProvider {...props}>{children}</SatellitesProvider>
    ),
  });

describe('SatellitesContext', () => {
  describe('drawAoiLayer', () => {
    it('is not returned when isDrawingAoi is false', () => {
      const { result } = renderContext();
      expect(result.current.drawAoiLayer).toBeUndefined();
    });

    it('is returned when isDrawingAoi is true', () => {
      const { result } = renderContext({ defaultIsDrawingAoi: true });
      expect(result.current.drawAoiLayer).toBeInstanceOf(EditableGeoJsonLayer);
    });
  });
});
