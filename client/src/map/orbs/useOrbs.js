import React, { lazy, useCallback, useEffect, useState } from 'react';

import { isArray } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';

import {
  activeDataSourcesSelector,
  selectDataToken,
  logError,
} from 'data-layers/data-layers.slice';
import { setIsLoading } from 'map/map.slice';
import { useMap } from 'MapContext';
import { dataUrlFromSource } from 'utils/data';
import { getData } from 'utils/http';
import { getAuthTokenForSource } from 'utils/tokens';

import { LayerFactory } from '../deck.gl/LayerFactory';
import { setData, layersWithDataSelector } from './layers.slice';
import { orbsSelector } from './orbsSelectors';

export const useOrbs = () => {
  const { setViewState } = useMap();
  const dispatch = useDispatch();
  const authTokens = useSelector(selectDataToken);
  const activeSources = useSelector(activeDataSourcesSelector);

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

  useEffect(() => {
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
  }, [activeSources, layersWithDataIds, fetchData, dispatch]);

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

  useEffect(() => {
    /** @type {[string, JSX.Element][]} */
    const components = activeSources.map(source => {
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
  }, [activeSources, dispatch, makeComponent]);

  useEffect(() => {
    const components = activeSources.map(source => {
      if (!source?.metadata?.application?.orbis?.map_component?.name)
        return null;
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

  useEffect(() => {
    /**
     * @param {import('typings').Source} source
     */
    const createLayer = async source => {
      if (!source?.metadata?.application?.orbis?.layer?.name) return undefined;
      const { props, name } = source.metadata.application.orbis.layer;
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
  ]);

  return {
    layers,
    mapComponents,
    sidebarComponents,
  };
};
