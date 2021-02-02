import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { useOrbs } from './useOrbs';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MapProvider } from 'MapContext';

const mockStore = configureMockStore([thunk]);

const setup = source =>
  renderHook(() => useOrbs(), {
    wrapper: ({ children }) => (
      <Provider
        store={mockStore({
          data: {
            layers: ['test/layer'],
            sources: [source],
          },
        })}
      >
        <MapProvider>{children}</MapProvider>
      </Provider>
    ),
  });

describe('useOrbs', () => {
  describe('sidebarComponents', () => {
    it('Adds null if the source does not have a sidebar_component name', () => {
      const source = {
        source_id: 'test/layer',
        metadata: {
          application: {
            orbis: {
              sidebar_component: {},
            },
          },
        },
      };
      const { result } = setup(source);
      expect(result.current.sidebarComponents['test/layer']).toBeNull();
    });

    it('Adds a component for the layer based on the sidebar_component property', () => {
      const source = {
        source_id: 'test/layer',
        metadata: {
          application: {
            orbis: {
              sidebar_component: {
                name: 'CheckboxFilters',
                props: {
                  test: 'hello',
                },
              },
            },
          },
        },
      };
      const { result } = setup(source);
      expect(result.current.sidebarComponents['test/layer']).toBeTruthy();
    });

    it('Puts the props from metadata into the component', () => {
      const source = {
        source_id: 'test/layer',
        metadata: {
          application: {
            orbis: {
              sidebar_component: {
                name: 'CheckboxFilters',
                props: {
                  test: 'hello',
                },
              },
            },
          },
        },
      };
      const { result } = setup(source);
      expect(result.current.sidebarComponents['test/layer'].props).toEqual(
        expect.objectContaining(
          source.metadata.application.orbis.sidebar_component.props,
        ),
      );
    });
  });

  describe('mapComponents', () => {});
});
