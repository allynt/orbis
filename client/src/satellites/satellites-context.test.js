import React from 'react';

import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { SatellitesProvider, useSatellites } from './satellites-context';

const mockStore = configureMockStore();

/**
 * @param {Omit<import('./satellites-context').SatellitesProviderProps, 'children'>} [props]
 */
const renderContext = props =>
  renderHook(() => useSatellites(), {
    wrapper: ({ children }) => (
      <Provider store={mockStore()}>
        <SatellitesProvider {...props}>{children}</SatellitesProvider>
      </Provider>
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
