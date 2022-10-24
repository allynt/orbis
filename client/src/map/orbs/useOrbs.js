import React, { lazy, useCallback, useEffect, useState } from 'react';

import { isArray } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectDataToken,
  logError,
  isCrossFilteringModeSelector,
  crossFilteringCommonGeometrySelector,
  activeCrossFilterPropertiesSelector,
} from 'data-layers/data-layers.slice';
import { setIsLoading } from 'map/map.slice';
import { useMap } from 'MapContext';
import { dataUrlFromSource } from 'utils/data';
import { getData } from 'utils/http';
import { getAuthTokenForSource } from 'utils/tokens';

import { LayerFactory } from '../deck.gl/LayerFactory';
import { setCrossFilterData } from './crossfilter-layers.slice';
import { setData, layersWithDataSelector } from './layers.slice';
import { orbsSelector } from './orbsSelectors';

export const useOrbs = activeSources => {
  const { setViewState } = useMap();
  const dispatch = useDispatch();
  const authTokens = useSelector(selectDataToken);
  const isCrossFilterMode = useSelector(isCrossFilteringModeSelector);
  const crossFilteringCommonGeometry = useSelector(
    crossFilteringCommonGeometrySelector,
  );
  const crossFilteringSelectedProperties = useSelector(
    activeCrossFilterPropertiesSelector,
  );

  const layersWithDataIds = useSelector(state =>
    layersWithDataSelector(state?.orbs),
  );

  /** @type {[any[], React.Dispatch<any[]>]} */
  const [layers, setLayers] = useState([]);
  /** @type {[JSX.Element[], React.Dispatch<JSX.Element[]>]} */
  const [mapComponents, setMapComponents] = useState([]);
  /** @type {[Record<string, JSX.Element | JSX.Element[]>, React.Dispatch<Record<string, JSX.Element | JSX.Element[]>>]} */
  const [sidebarComponents, setSidebarComponents] = useState({});
  const orbState = useSelector(orbsSelector);

  const fetchData = useCallback(
    async source => {
      const authToken = getAuthTokenForSource(authTokens, source);
      if (!authToken) {
        console.error(
          'ERROR: No auth token found for: ',
          source.source_id,
          ', in: ',
          authTokens,
        );
      }

      try {
        const response = await getData(dataUrlFromSource(source), {
          Authorization: `Bearer ${authToken}`,
        });

        if (!response.ok) {
          return dispatch(logError(source));
        }

        dispatch(setIsLoading(true));
        const data = await response.json();
        dispatch(setIsLoading(false));
        dispatch(
          setData({
            key: source.source_id,
            data,
          }),
        );
      } catch (ex) {
        return dispatch(logError(source));
      }
    },
    [authTokens, dispatch],
  );

  /**
   * Set data state to either tiles/url metadata value, or fetch the actual data
   * and set it in state (not sure when this last one is ever used, would need
   * more investigation)/
   */
  useEffect(() => {
    if (isCrossFilterMode) {
      // Get all active cross-filterable dataset URLs to set in state, so
      // they can be passed to the layer.
      const data = activeSources.map(source => {
        let url =
          source?.metadata?.application?.orbis?.crossfiltering?.tiles[0];
        url = url.replace(
          '{geometryType}',
          crossFilteringCommonGeometry.toLowerCase(),
        );

        return url;
      });

      dispatch(
        setCrossFilterData({
          key: 'crossFilteringLayerData',
          data,
        }),
      );
    } else {
      for (let source of activeSources) {
        if (
          !layersWithDataIds?.includes(source.source_id) &&
          source.metadata.request_strategy !== 'manual'
        ) {
          if (source.metadata.tiles)
            dispatch(
              setData({
                key: source.source_id,
                data: source.metadata.tiles,
              }),
            );
          else if (source.type === 'raster')
            dispatch(
              setData({
                key: source.source_id,
                data: source.metadata.url,
              }),
            );
          else fetchData(source);
        }
      }
    }
  }, [
    activeSources,
    layersWithDataIds,
    fetchData,
    dispatch,
    isCrossFilterMode,
    crossFilteringCommonGeometry,
  ]);

  // Instantiate a component with the selected layer and other props and
  // return it.
  const makeComponent = useCallback(
    (componentDefinition, source) => {
      if (!componentDefinition?.name) return null;
      const Component = lazy(() =>
        import(`./components/${componentDefinition.name}`),
      );
      const props = componentDefinition.props;
      return (
        <Component
          key={`${source.source_id}-${componentDefinition.name}`}
          selectedLayer={source}
          dispatch={dispatch}
          {...props}
        />
      );
    },
    [dispatch],
  );

  /**
   * Create (from metadata) and set in local state, the components to be used
   * in the sidebar.
   */
  useEffect(() => {
    /** @type {[string, JSX.Element][]} */
    const components = activeSources.map(source => {
      if (isCrossFilterMode) {
        const newSource = {
          ...source,
          properties: crossFilteringSelectedProperties[source.source_id],
        };
        return [
          source.source_id,
          makeComponent(
            source?.metadata?.application?.orbis?.crossfiltering
              ?.sidebar_component,
            newSource,
          ),
        ];
      } else {
        if (isArray(source?.metadata?.application?.orbis?.sidebar_component)) {
          return [
            source.source_id,
            source?.metadata?.application?.orbis?.sidebar_component.map(
              componentDefinition => makeComponent(componentDefinition, source),
            ),
          ];
        }
        return [
          source.source_id,
          makeComponent(
            source?.metadata?.application?.orbis?.sidebar_component,
            source,
          ),
        ];
      }
    });

    setSidebarComponents(
      components.reduce(
        (acc, [source_id, component]) => ({
          ...acc,
          [source_id]: component,
        }),
        {},
      ),
    );
  }, [
    activeSources,
    crossFilteringSelectedProperties,
    dispatch,
    isCrossFilterMode,
    makeComponent,
  ]);

  /**
   * Create (from metadata) and set in local state, the components to be used
   * in the map.
   */
  useEffect(() => {
    const components = activeSources.map(source => {
      if (!source?.metadata?.application?.orbis?.map_component?.name) {
        return null;
      }

      const Component = lazy(() =>
        import(
          `./components/${source.metadata.application.orbis.map_component.name}`
        ),
      );
      const props = source.metadata.application.orbis.map_component.props;
      return (
        <Component
          key={`${source.source_id}-${source.metadata.application.orbis.map_component.name}`}
          source={source}
          {...props}
        />
      );
    });
    setMapComponents(components);
  }, [activeSources, dispatch]);

  /**
   * Create (from metadata) the layers to be used on the map.
   */
  useEffect(() => {
    /**
     * @param {import('typings').Source} source
     */
    const createLayer = async source => {
      if (!source?.metadata?.application?.orbis?.layer?.name) return undefined;

      const { props, name } = isCrossFilterMode
        ? source?.metadata?.application?.orbis?.crossfiltering?.layer
        : source?.metadata?.application?.orbis?.layer;

      const { config, ...metadataConfig } = props;

      const authToken = getAuthTokenForSource(authTokens, source);
      if (!authToken) {
        console.error(
          'ERROR: No auth token found for: ',
          source.source_id,
          ', in: ',
          authTokens,
        );
      }

      let loadedConfig = {};
      if (config) {
        const imported = await import(`./configurations/${config}`);
        const configFn = imported.default;
        loadedConfig = configFn({
          id: source.source_id,
          activeSources,
          dispatch,
          setViewState,
          orbState,
          authToken,
          crossFilteringCommonGeometry,
          ...metadataConfig,
        });
      }

      const layer = LayerFactory(name, {
        ...metadataConfig,
        ...loadedConfig,
        dispatch,
      });

      return layer;
    };

    const layerPromises = activeSources.map(createLayer);
    Promise.all(layerPromises).then(setLayers);
  }, [
    activeSources,
    layersWithDataIds,
    dispatch,
    setViewState,
    orbState,
    authTokens,
    isCrossFilterMode,
  ]);

  return {
    layers,
    mapComponents,
    sidebarComponents,
  };
};
