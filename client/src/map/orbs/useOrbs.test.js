import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { useOrbs } from './useOrbs';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MapProvider } from 'MapContext';
import { waitFor } from '@testing-library/dom';

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

  describe('mapComponents', () => {
    const source = {
      source_id: 'test/layer',
      metadata: {
        application: {
          orbis: {
            map_component: {
              name: 'Something',
              props: {
                hello: 'Test',
              },
            },
          },
        },
      },
    };
    it('Adds a component to the array for the source', () => {
      const { result } = setup(source);
      expect(result.current.mapComponents[0]).toBeTruthy();
    });

    it('Spreads the props from metadata onto the component', () => {
      const { result } = setup(source);
      expect(result.current.mapComponents[0].props).toEqual(
        expect.objectContaining(
          source.metadata.application.orbis.map_component.props,
        ),
      );
    });

    it('Puts null into the array if source does not have a map component name', () => {
      const { result } = setup({
        source_id: 'test/layer',
        metadata: {
          application: {
            orbis: {
              map_component: {},
            },
          },
        },
      });
      expect(result.current.mapComponents[0]).toBeNull();
    });
  });

  describe('layers', () => {
    it('Returns undefined if the layer name is missing', async () => {
      const { result } = setup({
        source_id: 'test/layer',
        metadata: {
          application: {
            orbis: {
              layer: {},
            },
          },
        },
      });
      await waitFor(() => expect(result.current.layers[0]).toBeUndefined());
    });

    it('Returns a layer if name is present', async () => {
      const { result } = setup({
        source_id: 'test/layer',
        metadata: {
          application: {
            orbis: {
              layer: {
                name: 'GeoJsonClusteredIconLayer',
                props: { config: 'pinIconConfig' },
              },
            },
          },
        },
      });
      await waitFor(() => expect(result.current.layers[0]).toBeTruthy());
    });
  });
});
