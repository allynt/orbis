import * as React from 'react';

import { waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react-hooks';
import { rest } from 'msw';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MapProvider } from 'MapContext';
import { server } from 'mocks/server';

import { useOrbs } from './useOrbs';

const mockStore = configureMockStore([thunk]);

const setup = async (source, activeSources) => {
  const utils = renderHook(() => useOrbs(activeSources), {
    wrapper: ({ children }) => (
      <Provider
        store={mockStore({
          data: {
            layers: ['test/layer'],
            sources: [source],
            tokens: {
              'test/layer': 'testAuthToken',
              'test/layer2': 'testAuthToken2',
            },
            isCrossFilteringMode: false,
            crossFilteringCommonGeometry: 'LAD_2019',
          },
        })}
      >
        <MapProvider>{children}</MapProvider>
      </Provider>
    ),
  });
  await act(async () => {
    await utils.waitForNextUpdate();
  });
  return utils;
};

describe('useOrbs', () => {
  describe('sidebarComponents', () => {
    beforeEach(() => {
      server.use(
        rest.get('*/api/test/url', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        }),
      );
    });

    it('Adds null if the source does not have a sidebar_component name', async () => {
      const source = {
        source_id: 'test/layer',
        metadata: {
          url: 'api/test/url',
          application: {
            orbis: {
              sidebar_component: {},
            },
          },
        },
      };
      const activeSources = [source];
      const { result } = await setup(source, activeSources);
      expect(result.current.sidebarComponents['test/layer']).toBeNull();
    });

    it('Adds a component for the layer based on the sidebar_component property', async () => {
      const source = {
        source_id: 'test/layer',
        metadata: {
          url: 'api/test/url',
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
      const activeSources = [source];
      const { result } = await setup(source, activeSources);
      expect(result.current.sidebarComponents['test/layer']).toBeTruthy();
    });

    it('Puts the props from metadata into the component', async () => {
      const source = {
        source_id: 'test/layer',
        metadata: {
          url: 'api/test/url',
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
      const activeSources = [source];
      const { result } = await setup(source, activeSources);
      expect(result.current.sidebarComponents['test/layer'].props).toEqual(
        expect.objectContaining(
          source.metadata.application.orbis.sidebar_component.props,
        ),
      );
    });

    it('Provides an array if sidebar_components is an array', async () => {
      const source = {
        source_id: 'test/layer',
        metadata: {
          url: 'api/test/url',
          application: {
            orbis: {
              sidebar_component: [
                {
                  name: 'CheckboxFilters',
                  props: {
                    testProp: 'prop1',
                  },
                },
                {
                  name: 'PopulationLegend',
                  props: {
                    testProp: 'prop2',
                  },
                },
              ],
            },
          },
        },
      };
      const activeSources = [source];
      const { result } = await setup(source, activeSources);
      expect(result.current.sidebarComponents['test/layer'].length).toBe(2);
      expect(result.current.sidebarComponents['test/layer'][0].props).toEqual(
        expect.objectContaining(
          source.metadata.application.orbis.sidebar_component[0].props,
        ),
      );
      expect(result.current.sidebarComponents['test/layer'][1].props).toEqual(
        expect.objectContaining(
          source.metadata.application.orbis.sidebar_component[1].props,
        ),
      );
    });
  });

  describe('mapComponents', () => {
    let source = null;
    let activeSources = null;

    beforeEach(() => {
      source = {
        source_id: 'test/layer',
        metadata: {
          url: 'api/test/url',
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
      activeSources = [source];
      server.use(
        rest.get('*/api/test/url', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        }),
      );
    });

    it('Adds a component to the array for the source', async () => {
      const { result } = await setup(source, activeSources);
      expect(result.current.mapComponents[0]).toBeTruthy();
    });

    it('Spreads the props from metadata onto the component', async () => {
      const { result } = await setup(source, activeSources);
      expect(result.current.mapComponents[0].props).toEqual(
        expect.objectContaining(
          source.metadata.application.orbis.map_component.props,
        ),
      );
    });

    it('Puts null into the array if source does not have a map component name', async () => {
      const mapSource = {
        source_id: 'test/layer',
        metadata: {
          url: 'api/test/url',
          application: {
            orbis: {
              map_component: {},
            },
          },
        },
      };
      const mapActiveSources = [mapSource];
      const { result } = await setup(mapSource, mapActiveSources);
      expect(result.current.mapComponents[0]).toBeNull();
    });
  });

  describe('layers', () => {
    beforeEach(() => {
      server.use(
        rest.get('*/api/test/url', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        }),
      );
    });

    it('Returns undefined if the layer name is missing', async () => {
      const source = {
        source_id: 'test/layer',
        metadata: {
          url: 'api/test/url',
          application: {
            orbis: {
              layer: {},
            },
          },
        },
      };
      const activeSources = [source];
      const { result } = await setup(source, activeSources);
      await waitFor(() => expect(result.current.layers[0]).toBeUndefined());
    });

    it('Returns a layer if name is present', async () => {
      const source = {
        source_id: 'test/layer',
        metadata: {
          url: 'api/test/url',
          application: {
            orbis: {
              layer: {
                name: 'GeoJsonClusteredIconLayer',
                props: { config: 'pinIconConfig' },
              },
            },
          },
        },
      };
      const activeSources = [source];
      const { result } = await setup(source, activeSources);
      await waitFor(() => expect(result.current.layers[0]).toBeTruthy());
    });
  });
});
