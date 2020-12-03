import React, { lazy, useCallback, useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {
  activeDataSourcesSelector,
  selectDataToken,
  logError,
} from 'data-layers/data-layers.slice';
import { getData } from 'utils/http';
import { useMap } from 'MapContext';
import { LayerFactory } from '../deck.gl/LayerFactory';
import { orbsSelector } from './orbsSelectors';

const dataUrlFromId = source => {
  return source.data && typeof source.data === 'string'
    ? source.data
    : source.metadata.url;
};

export const useOrbs = () => {
  const { setViewState } = useMap();
  const dispatch = useDispatch();
  const authToken = useSelector(selectDataToken);
  /** @type {Source[]} */
  const activeSources = useSelector(activeDataSourcesSelector);
  const [data, setData] = useState({});
  const [layers, setLayers] = useState([]);
  const [mapComponents, setMapComponents] = useState([]);
  const [sidebarComponents, setSidebarComponents] = useState({});
  const orbState = useSelector(orbsSelector);

  const fetchData = useCallback(
    async source => {
      try {
        const response = await getData(dataUrlFromId(source), {
          Authorization: `Bearer ${authToken}`,
        });

        if (!response.ok) {
          return dispatch(logError(source));
        }

        const dataSet = await response.json();
        setData({ ...data, [source.source_id]: dataSet });
      } catch (ex) {
        return dispatch(logError(source));
      }
    },
    [authToken, data, dispatch],
  );

  useEffect(() => {
    for (let source of activeSources) {
      if (
        !data[source.source_id] &&
        source.metadata.request_strategy !== 'manual'
      ) {
        if (source.metadata.tiles)
          setData({ ...data, [source.source_id]: source.metadata.tiles });
        else fetchData(source);
      }
    }
  }, [activeSources, data, fetchData]);

  useEffect(() => {
    /** @type {[string, JSX.Element][]} */
    const components = activeSources.map(source => {
      if (!source?.metadata?.application?.orbis?.sidebar_component?.name)
        return [source.source_id, null];
      const Component = lazy(() =>
        import(
          `./components/${source.metadata.application.orbis.sidebar_component.name}`
        ),
      );
      const props = source.metadata.application.orbis.sidebar_component.props;
      return [
        source.source_id,
        <Component selectedLayer={source} dispatch={dispatch} {...props} />,
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
  }, [activeSources, dispatch]);

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
      return <Component {...props} />;
    });
    setMapComponents(components);
  }, [activeSources, dispatch]);

  useEffect(() => {
    /**
     * @param {Source} source
     */
    const createLayer = async source => {
      if (!source?.metadata?.application?.orbis?.layer?.name) return undefined;
      const { props, name } = source.metadata.application.orbis.layer;
      const { config, ...metadataConfig } = props;

      let loadedConfig = {};
      if (config) {
        const imported = await import(`./configurations/${config}`);
        const configFn = imported.default;
        loadedConfig = configFn({
          id: source.source_id,
          data: data[source.source_id],
          activeSources,
          dispatch,
          setViewState,
          orbState,
          authToken,
          ...metadataConfig,
        });
      }

      const layer = LayerFactory(name, {
        ...loadedConfig,
        ...metadataConfig,
        dispatch,
      });

      return layer;
    };
    const layerPromises = activeSources.map(createLayer);
    Promise.all(layerPromises).then(setLayers);
  }, [activeSources, data, dispatch, setViewState, orbState, authToken]);

  return {
    layers,
    mapComponents,
    sidebarComponents,
  };
};
